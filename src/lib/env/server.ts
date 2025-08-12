import { createEnv } from "@t3-oss/env-nextjs";
import "dotenv/config";
import * as z from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.url(),
		DATABASE_LOCAL_URL: z.string(),
		REDIS_URL: z.url(),
		REDIS_TOKEN: z.string().min(1),
		SESSION_KEY: z.string().min(1),
		SESSION_EXPIRATION_SECONDS: z.number(),

		OAUTH_REDIRECT_URL: z.url(),
		STATE_COOKIE_KEY: z.string().min(1),
		CODE_VERIFIER_COOKIE_KEY: z.string(),
		COOKIE_EXPIRATION_SECONDS: z.number(),

		DISCORD_CLIENT_ID: z.string().min(1),
		DISCORD_CLIENT_SECRET: z.string().min(1),
		GITHUB_CLIENT_ID: z.string().min(1),
		GITHUB_CLIENT_SECRET: z.string().min(1),
		GOOGLE_CLIENT_ID: z.string().min(1),
		GOOGLE_CLIENT_SECRET: z.string().min(1),
	},
	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
		DATABASE_LOCAL_URL: process.env.DATABASE_LOCAL_URL,
		REDIS_URL: process.env.REDIS_URL,
		REDIS_TOKEN: process.env.REDIS_TOKEN,
		SESSION_KEY: process.env.SESSION_KEY,
		SESSION_EXPIRATION_SECONDS:
			Number(process.env.SESSION_EXPIRATION_SECONDS) || 3600,

		OAUTH_REDIRECT_URL: process.env.OAUTH_REDIRECT_URL,
		STATE_COOKIE_KEY: process.env.STATE_COOKIE_KEY,
		CODE_VERIFIER_COOKIE_KEY: process.env.CODE_VERIFIER_COOKIE_KEY,
		COOKIE_EXPIRATION_SECONDS:
			Number(process.env.COOKIE_EXPIRATION_SECONDS) || 604800,

		DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
		DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
		GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
		GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
	},
});
