import { env } from "@/lib/env/server";
import * as z from "zod";
import { OAuthClient } from "../base";

export function createGoogleOAuthClient() {
	return new OAuthClient({
		provider: "google",
		client_id: env.GOOGLE_CLIENT_ID,
		client_secret: env.GOOGLE_CLIENT_SECRET,
		scopes: [
			"openid",
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		],
		urls: {
			auth: "https://accounts.google.com/o/oauth2/v2/auth",
			token: "https://oauth2.googleapis.com/token",
			user: "https://www.googleapis.com/oauth2/v2/userinfo",
		},
		userInfo: {
			schema: z.object({
				id: z.string(),
				name: z.string(),
				email: z.email(),
			}),
			parser: (user) => ({
				id: user.id,
				name: user.name,
				email: user.email,
			}),
		},
	});
}
