import { userRoles } from "@/types/user";
import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const UserRoleEnum = pgEnum("roles", userRoles);
export const UserTable = pgTable("users", {
	id: uuid().primaryKey().defaultRandom(),
	email: varchar({ length: 255 }).notNull().unique(),
	isVerified: timestamp({ withTimezone: true }),
	username: varchar({ length: 255 }).notNull(),
	fullname: varchar({ length: 255 }),
	password: varchar({ length: 255 }),
	salt: varchar({ length: 255 }),
	role: UserRoleEnum().default("user").notNull(),
	createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true })
		.defaultNow()
		.$onUpdateFn(() => new Date())
		.notNull(),
});
