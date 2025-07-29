"use server";

import { roleEnum } from "@/drizzle/schemas/user";
import { env } from "@/lib/env/server";
import { cookies } from "next/headers";
import * as z from "zod";
import { getRandomWebBit } from "../lib/hasher";
import { redisClient } from "../lib/redis";

const SSessionSchema = z.object({
	id: z.uuid(),
	role: z.enum(roleEnum),
});

export type TSession = z.infer<typeof SSessionSchema>;

export const createUserSession = async (unsafeData: TSession) => {
	const cookieStore = await cookies();
	const sessionID = Buffer.from(getRandomWebBit(32)).toString("base64");
	const {
		success,
		data: safeSession,
		error,
	} = SSessionSchema.safeParse(unsafeData);
	if (!success) throw new Error(`Invalid session data: ${error.message}`);
	await redisClient.set(`session:${sessionID}`, safeSession, {
		ex: env.SESSION_EXPIRATION_SECONDS,
	});
	cookieStore.set(env.SESSION_KEY, sessionID, {
		secure: true,
		httpOnly: true,
		sameSite: "lax",
		expires: Date.now() + env.SESSION_EXPIRATION_SECONDS,
	});
};

export const getUserSession = async (): Promise<TSession | null> => {
	const cookieStore = await cookies();
	const sessionID = cookieStore.get(env.SESSION_KEY)?.value;
	if (!sessionID) return null;

	const sessionData = await redisClient.get(`session:${sessionID}`);
	if (!sessionData) return null;

	const {
		success,
		data: safeSession,
		error,
	} = SSessionSchema.safeParse(sessionData);
	if (!success) return null;
	return safeSession;
};

export const deleteUserSession = async () => {
	const cookieStore = await cookies();
	const sessionID = cookieStore.get(env.SESSION_KEY)?.value;
	if (!sessionID) return null;
	await redisClient.del(`session:${sessionID}`);
	cookieStore.delete(env.SESSION_KEY);
};

export const updateUserSession = async (unsafeData: TSession) => {
	const cookieStore = await cookies();
	const sessionID = cookieStore.get(env.SESSION_KEY)?.value;
	if (!sessionID) return null;
	const {
		success,
		data: safeSession,
		error,
	} = SSessionSchema.safeParse(unsafeData);
	if (!success) throw new Error(`Invalid session data: ${error.message}`);
	await redisClient.set(`session:${sessionID}`, safeSession, {
		ex: env.SESSION_EXPIRATION_SECONDS,
	});
};

export const updateUserSessionExpiration = async () => {
	const cookieStore = await cookies();
	const sessionID = cookieStore.get(env.SESSION_KEY)?.value;
	if (!sessionID) return null;

	const user = await getUserSession();
	if (!user) return null;
	await redisClient.expire(
		`session:${sessionID}`,
		env.SESSION_EXPIRATION_SECONDS,
	);
	cookieStore.set(env.SESSION_KEY, sessionID, {
		secure: true,
		httpOnly: true,
		sameSite: "lax",
		expires: Date.now() + env.SESSION_EXPIRATION_SECONDS,
	});
};
