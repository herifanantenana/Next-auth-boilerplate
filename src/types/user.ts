import * as z from "zod";

/* -------------------------------- constant -------------------------------- */

export const userRoles = ["admin", "user"] as const;

/* --------------------------------- schema --------------------------------- */

const S_B_user = z.object({
	id: z.uuid({ message: "Invalid UUID" }),
	email: z.email({ message: "Invalid email address" }),
	isVerified: z.date().optional().nullable(),
	username: z
		.string()
		.min(1, { message: "Username is required" })
		.max(255, { message: "Username too long" }),
	fullname: z
		.string()
		.max(255, { message: "Full name too long" })
		.optional()
		.nullable(),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters" })
		.max(255, { message: "Password too long" })
		.optional(),
	salt: z
		.string()
		.min(1, { message: "Salt is required" })
		.max(255, { message: "Salt too long" })
		.optional(),
	role: z.enum(userRoles, { message: "Invalid role" }).default("user"),
	createdAt: z.date({ message: "Invalid createdAt date" }),
	updatedAt: z.date({ message: "Invalid updatedAt date" }),
});

export const S_User = {
	insert: S_B_user.omit({ id: true, createdAt: true, updatedAt: true }),
	register: S_B_user.pick({ email: true, username: true }).extend({
		password: z
			.string()
			.min(8, { message: "Password must be at least 8 characters" })
			.max(255, { message: "Password too long" }),
	}),
	login: S_B_user.pick({ email: true }).extend({
		password: z
			.string()
			.min(1, { message: "Password is required" })
			.max(255, { message: "Password too long" }),
	}),
};

/* ---------------------------------- type ---------------------------------- */

export type T_UserRoles = (typeof userRoles)[number];
export type T_User<T extends keyof typeof S_User> = z.infer<(typeof S_User)[T]>;
