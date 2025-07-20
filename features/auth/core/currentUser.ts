import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schemas";
import { eq } from "drizzle-orm";
import { getUserSession } from "./session";
import { redirect } from "next/navigation";
import { cache } from "react";

const getUserDb = async (userId: string) => {
	return await db.query.UserTable.findFirst({
		where: eq(UserTable.id, userId),
		columns: { id: true, name: true, email: true, role: true },
	});
};


type TFullUser = Exclude<Awaited<ReturnType<typeof getUserDb>>, undefined>;
type TUser = Exclude<Awaited<ReturnType<typeof getUserSession>>, null>;

async function _getCurrentUser(options: {
	withFullUser: true;
	redirectIfNotFound: true;
}): Promise<TFullUser>;
async function _getCurrentUser(options: {
	withFullUser: true;
	redirectIfNotFound?: false;
}): Promise<TFullUser | null>;
async function _getCurrentUser(options: {
	withFullUser?: false;
	redirectIfNotFound: true;
}): Promise<TUser>;
async function _getCurrentUser(options?: {
	withFullUser?: false;
	redirectIfNotFound?: false;
}): Promise<TUser | null>;
async function _getCurrentUser({
	withFullUser = false,
	redirectIfNotFound = false,
} = {}) {
	const user = await getUserSession();

	if (user == null) {
		if (redirectIfNotFound) return redirect("/sign-in");
		return null;
	}

	if (withFullUser) {
		const fullUser = await getUserDb(user.id);
		if (fullUser == null) throw new Error("User not found in database");
		return fullUser;
	}

	return user;
}
export const getCurrentUser = cache(_getCurrentUser);
