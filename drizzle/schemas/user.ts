import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import * as z from "zod";

export const roleEnum = ["admin", "user"] as const;
export type TRole = (typeof roleEnum)[number];
export const RoleEnum = pgEnum("roles", roleEnum);

export const UserTable = pgTable("users", {
	id: uuid().primaryKey().defaultRandom(),
	name: varchar({ length: 256 }).notNull(),
	email: varchar({ length: 256 }).unique().notNull(),
	password: varchar({ length: 256 }).notNull(),
	salt: varchar({ length: 256 }).notNull(),
	role: RoleEnum().default("user").notNull(),
	createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true })
		.defaultNow()
		.$onUpdateFn(() => new Date())
		.notNull(),
});

const SUserSchema = z.object({
	id: z.uuid(),
	name: z.string().min(1, "Name is required"),
	email: z.email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters long"),
	salt: z.string(),
	role: z.enum(roleEnum).default("user"),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const SBaseUserSchema = {
	insert: SUserSchema.omit({ id: true, createdAt: true, updatedAt: true }),
	signUp: SUserSchema.pick({ name: true, email: true, password: true }),
	signIn: z.object({
		email: SUserSchema.shape.email,
		password: z.string().min(1, "Password is required"),
	}),
};

export type TBaseUser<T extends keyof typeof SBaseUserSchema> = z.infer<
	(typeof SBaseUserSchema)[T]
>;
