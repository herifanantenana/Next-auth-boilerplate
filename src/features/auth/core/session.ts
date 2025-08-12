"use server";

import { env } from "@/lib/env/server";
import { S_Session, T_Session } from "@/types/session";
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
		console.log("sessionToken -----", sessionToken);
		if (!sessionToken) return null;

		/* Get Session From Redis ----------- */
		const sessionRedis = await redisClient.get(sessionToken);
		console.log("sessionRedis -----", sessionRedis);
		if (!sessionRedis) return null;

		/* Parse Session Data ---------------- */
		const {
			success: successSessionData,
			data: safeSessionData,
			error: errorSessionData,
		} = S_Session.insertRedis.safeParse(sessionRedis);
		console.log("errorSessionData -----", errorSessionData);

		if (!successSessionData) return null;

		return safeSessionData;
	};
