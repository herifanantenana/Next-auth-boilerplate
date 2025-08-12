import { userRoles } from "@/types/user";
import { relations } from "drizzle-orm";
import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { SessionTable } from "./session";

/* ______________ ENUM ______________ */

export const UserRoleEnum = pgEnum("user_roles", userRoles);

/* ______________ TABLE ______________ */
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

/* _____________ RELATION ____________ */
export const UserRelation = relations(UserTable, ({ many }) => ({
	sessions: many(SessionTable),
}));
