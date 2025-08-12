import { env } from "@/lib/env/server";
import { Redis } from "@upstash/redis";

/* _______ CREATE REDIS CLIENT ______ */
export const redisClient = new Redis({
	url: env.REDIS_URL,
	token: env.REDIS_TOKEN,
});

