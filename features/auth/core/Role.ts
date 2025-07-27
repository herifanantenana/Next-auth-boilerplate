"use server";

import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schemas";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "./currentUser";
import { updateUserSession } from "./session";

export const AToggleRole = async () => {
	const currentUser = await getCurrentUser({ redirectIfNotFound: true });

	const [user] = await db
		.update(UserTable)
		.set({ role: currentUser.role === "admin" ? "user" : "admin" })
		.where(eq(UserTable.id, currentUser.id))
		.returning({ id: UserTable.id, role: UserTable.role });
	await updateUserSession({ id: user.id, role: user.role });
};
