import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import * as z from "zod";

export const roles = ["admin", "user"] as const;

/* --------------------------------- drizzle -------------------------------- */

export const RoleEnum = pgEnum("roles", roles);
export const UserTable = pgTable("users", {
	id: uuid().primaryKey().defaultRandom(),
	email: varchar({ length: 255 }).notNull().unique(),
	isVerified: timestamp({ withTimezone: true }),
	username: varchar({ length: 255 }).notNull(),
	fullname: varchar({ length: 255 }),
	password: varchar({ length: 255 }),
	salt: varchar({ length: 255 }),
	role: RoleEnum().default("user").notNull(),
	createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true })
		.defaultNow()
		.$onUpdateFn(() => new Date())
		.notNull(),
});

/* --------------------------------- schema --------------------------------- */

const S_B_user = z.object({
	id: z.uuid(),
	email: z.email(),
	isVerified: z.date().nullable(),
	username: z.string().min(1).max(255),
	fullname: z.string().max(255).nullable(),
	password: z.string().min(8).max(255).optional(),
	salt: z.string().min(1).max(255).optional(),
	role: z.enum(roles).default("user"),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const S_User = {
	insert: S_B_user.omit({ id: true, createdAt: true, updatedAt: true }),
	signUp: S_B_user.pick({ email: true, username: true }).extend({
		password: z.string().min(8).max(255),
	}),
	signIn: S_B_user.pick({ email: true }).extend({
		password: z.string().min(1).max(255),
	}),
};

/* ---------------------------------- type ---------------------------------- */

export type T_Roles = (typeof roles)[number];
export type T_User<T extends keyof typeof S_User> = z.infer<(typeof S_User)[T]>;
