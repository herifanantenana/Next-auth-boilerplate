import { db } from "@/drizzle/db";
import { OAuthAccountTable, UserTable } from "@/drizzle/schemas";
import { TProviderOAuth } from "@/drizzle/schemas/oAuthAccount";
import { createUserSession } from "@/features/auth/core/session";
import { createOAuthClient } from "@/features/auth/oauth/base";
import { env } from "@/lib/env/client";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ provider: TProviderOAuth }> },
) {
	const { provider } = await params;
	const cookiesStore = await cookies();
	const code = request.nextUrl.searchParams.get("code");
	const state = request.nextUrl.searchParams.get("state");
	if (typeof code !== "string" || typeof state !== "string") {
		const urlError = new URL("/sign-in", env.NEXT_PUBLIC_APP_BASE_URL);
		urlError.searchParams.set(
			"oauthError",
			encodeURIComponent("Invalid OAuth code or state, Please try again!"),
		);
		return NextResponse.redirect(urlError.toString());
	}
	try {
		const oAuthUser = await createOAuthClient(provider).fetchUser(
			code,
			state,
			cookiesStore,
		);
		console.log("OAuth User:", oAuthUser);
		const user = await connectOAuthUserToAccount(oAuthUser, provider);
		console.log("Connected OAuth User:", user);
		await createUserSession(user);
	} catch (error) {
		console.log("OAuth Error:", error);
		const urlError = new URL("/sign-in", env.NEXT_PUBLIC_APP_BASE_URL);
		urlError.searchParams.set(
			"oauthError",
			encodeURIComponent("Failed to connect OAuth account, Please try again!"),
		);
		return NextResponse.redirect(urlError.toString());
	}
	return redirect("/");
}

function connectOAuthUserToAccount(
	oAuthUSer: { id: string; name: string; email: string },
	provider: TProviderOAuth,
) {
	return db.transaction(async (tx) => {
		let user = await tx.query.UserTable.findFirst({
			where: eq(UserTable.email, oAuthUSer.email),
			columns: { id: true, role: true },
		});
		if (!user) {
			const [newUser] = await tx
				.insert(UserTable)
				.values({
					email: oAuthUSer.email,
					name: oAuthUSer.name,
				})
				.returning({ id: UserTable.id, role: UserTable.role });
			user = newUser;
		}
		await tx
			.insert(OAuthAccountTable)
			.values({
				userId: user.id,
				provider,
				providerAccountId: oAuthUSer.id,
			})
			.onConflictDoNothing();
		return user;
	});
}
