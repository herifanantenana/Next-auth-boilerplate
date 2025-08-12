import * as schemas from "@/drizzle/schemas";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { reset } from "drizzle-seed";

import { Pool } from "pg";

async function main() {
	const pool = new Pool({ connectionString: process.env.DATABASE_LOCAL_URL });
	const db = drizzle(pool, { schema: schemas });
	await reset(db, schemas);
}
main();
