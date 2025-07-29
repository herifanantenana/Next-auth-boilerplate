"use server";

import { TProviderOAuth } from "@/drizzle/schemas/oAuthAccount";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createOAuthClient } from "./base";

export const AOAuth = async (provider: TProviderOAuth) => {
	const cookieStore = await cookies();
	redirect(createOAuthClient(provider).createAuthUrl(cookieStore));
};
