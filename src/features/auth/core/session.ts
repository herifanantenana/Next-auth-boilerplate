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
	} = S_Session.insertRedis.safeParse({
		...unsafeSession,
		expiredAt: new Date(unsafeSession.expiredAt),
	});
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
		expires: safeSessionData.expiredAt,
	});
};
