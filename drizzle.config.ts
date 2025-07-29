import { env } from "@/lib/env/server";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./drizzle/schemas",
	out: "./drizzle/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: env.DATABASE_URL,
	},
	strict: true,
	verbose: true,
});
