"use server";

import { db } from "@/drizzle/db";
import { SessionTable } from "@/drizzle/schemas/session";
import { env } from "@/lib/env/server";
import { S_Session, T_Session } from "@/types/session";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redisClient } from "../lib/redis";

export const createRedisUserSession = async (
	unsafeSession: T_Session<"insertRedis">,
) => {
	/* Parse Session Data --------------- */
	const {
		success: successSessionData,
		data: safeSessionData,
		error: errorSessionData,
	} = S_Session.insertRedis.safeParse(unsafeSession);
	if (!successSessionData) throw errorSessionData;

	/* Create Session On Redis ---------- */
	await redisClient.set(safeSessionData.sessionToken, safeSessionData, {
		ex: env.SESSION_EXPIRATION_SECONDS,
	});

	/* Add Session In Cookie ------------ */
	const cookieStore = await cookies();
	cookieStore.set(env.SESSION_KEY, safeSessionData.sessionToken, {
		secure: true,
		httpOnly: true,
		sameSite: "lax",
		expires: new Date(Date.now() + env.SESSION_EXPIRATION_SECONDS * 1000),
	});
};

/* _______ GET CURRENT SESSION ______ */
export const getCurrentSession =
	async (): Promise<T_Session<"insertRedis"> | null> => {
		/* Get Session Token From Cookie --- */
		const cookieStore = await cookies();
		const sessionToken = cookieStore.get(env.SESSION_KEY)?.value;
		if (!sessionToken) return null;

		/* Get Session From Redis ----------- */
		const sessionRedis = await redisClient.get(sessionToken);
		if (!sessionRedis) return null;

		/* Parse Session Data ---------------- */
		const {
			success: successSessionData,
			data: safeSessionData,
			error: errorSessionData,
		} = S_Session.insertRedis.safeParse(sessionRedis);

		if (!successSessionData) return null;

		return safeSessionData;
	};

/* _____ DELETE CURRENT SESSION _____ */
export const deleteCurrentSession = async () => {
	/* Get Current Session -------------- */
	const currentSession = await getCurrentSession();
	if (!currentSession) return null;

	/* Delete Session On Cookie -------- */
	const cookieStore = await cookies();
	cookieStore.delete(env.SESSION_KEY);

	/* Delete Session On Redis ---------- */
	await redisClient.del(currentSession.sessionToken);

	/* Set Session Inactive On Db ------- */
	await db
		.update(SessionTable)
		.set({
			sessionStatus: "revoked",
		})
		.where(
			and(
				eq(SessionTable.id, currentSession.sessionId),
				eq(SessionTable.sessionToken, currentSession.sessionToken),
			),
		);
};
