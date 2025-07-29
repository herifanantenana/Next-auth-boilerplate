"use server";
import { db } from "@/drizzle/db";
import { SBaseUserSchema, TBaseUser, UserTable } from "@/drizzle/schemas/user";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { getRandomWebBit, hashPassword, verifyPassword } from "../lib/hasher";
import { createUserSession, deleteUserSession } from "./session";

export const ASignUp = async (
	unsafeData: TBaseUser<"signUp">,
): Promise<ZodError | string | unknown> => {
	const {
		success: inputSuccess,
		data: safeInput,
		error: inputError,
	} = SBaseUserSchema.signUp.safeParse(unsafeData);
	if (!inputSuccess) return inputError;

	try {
		const existingUser = await db.query.UserTable.findFirst({
			where: eq(UserTable.email, safeInput.email),
		});
		if (existingUser) return "User already exists";
	} catch (error) {
		console.log("Error checking user:", error);
		return error;
	}

	const salt = getRandomWebBit();
	const hashedPassword = await hashPassword(safeInput.password, salt);

	const {
		success: insertSuccess,
		data: parsedInsert,
		error: insertError,
	} = SBaseUserSchema.insert.safeParse({
		name: safeInput.name,
		email: safeInput.email,
		password: hashedPassword,
		salt: Buffer.from(salt).toString("base64"),
	});
	if (!insertSuccess) return insertError;

	try {
		const [newUser] = await db
			.insert(UserTable)
			.values(parsedInsert)
			.returning({ id: UserTable.id, role: UserTable.role });
		if (!newUser) return "Failed to create user";

		await createUserSession(newUser);
	} catch (error) {
		console.log("Error inserting user:", error);
		return error;
	}

	redirect("/");
};

export const ASignIn = async (
	unsafeData: TBaseUser<"signIn">,
): Promise<ZodError | string | unknown> => {
	const {
		success: inputSuccess,
		data: safeInput,
		error: inputError,
	} = SBaseUserSchema.signIn.safeParse(unsafeData);
	if (!inputSuccess) return inputError;

	let user;
	try {
		user = await db.query.UserTable.findFirst({
			where: eq(UserTable.email, safeInput.email),
			columns: { id: true, password: true, salt: true, role: true },
		});
		if (!user) return "User not found";
	} catch (error) {
		console.log("Error fetching user:", error);
		return error;
	}
	if (!user.password || !user.salt) return "User has no password set";

	const validPassword = await verifyPassword(
		safeInput.password,
		user.password!,
		Uint8Array.from(Buffer.from(user.salt!, "base64")),
	);
	if (!validPassword) return "Invalid password";

	try {
		await createUserSession({ id: user.id, role: user.role });
	} catch (error) {
		console.log("Error creating session:", error);
		return error;
	}
	redirect("/");
};

export const ALogOut = async () => {
	await deleteUserSession();
	redirect("/");
};
