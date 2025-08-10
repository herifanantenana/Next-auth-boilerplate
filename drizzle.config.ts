import env  from "@/lib/env/server";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./src/drizzle/schemas",
	out: "./src/drizzle/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: env.DATABASE_URL,
	},
	strict: true,
	verbose: true,
});
