import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.url(),
		REDIS_URL: z.url(),
		REDIS_TOKEN: z.string(),
		SESSION_KEY: z.string(),
		SESSION_EXPIRATION_SECONDS: z.number(),
	},
	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
		REDIS_URL: process.env.REDIS_URL,
		REDIS_TOKEN: process.env.REDIS_TOKEN,
		SESSION_KEY: process.env.SESSION_KEY,
		SESSION_EXPIRATION_SECONDS:
			Number(process.env.SESSION_EXPIRATION_SECONDS) || 3600,
	},
});
