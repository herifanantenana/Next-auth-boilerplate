import { TProviderOAuth } from "@/drizzle/schemas/oAuthAccount";
import { env } from "@/lib/env/server";
import crypto from "crypto";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import * as z from "zod";
import { createDiscordOAuthClient } from "./provider/discord";
import { createGithubOAuthClient } from "./provider/github";
import { createGoogleOAuthClient } from "./provider/google";

export function createOAuthClient<T>(provider: TProviderOAuth) {
	switch (provider) {
		case "discord":
			return createDiscordOAuthClient();
		case "github":
			return createGithubOAuthClient();
		case "google":
			return createGoogleOAuthClient();
		default:
			throw new Error(`Unsupported OAuth provider: ${provider}`);
	}
}

export class OAuthClient<T> {
	private readonly _provider: TProviderOAuth;
	private readonly _client_id: string;
	private readonly _client_secret: string;
	private readonly _scopes: string[];
	private readonly urls: {
		auth: string;
		token: string;
		user: string;
	};
	private readonly _userInfo: {
		schema: z.ZodSchema<T>;
		parser: (data: T) => { id: string; name: string; email: string };
	};
	private readonly _STokenSchema = z.object({
		access_token: z.string(),
		token_type: z.string(),
		expires_in: z.number().optional(),
		scope: z.string(),
		refresh_token: z.string().optional(),
	});

	constructor({
		provider,
		client_id,
		client_secret,
		scopes,
		urls,
		userInfo,
	}: {
		provider: TProviderOAuth;
		client_id: string;
		client_secret: string;
		scopes: string[];
		urls: { auth: string; token: string; user: string };
		userInfo: {
			schema: z.ZodSchema<T>;
			parser: (data: T) => { id: string; name: string; email: string };
		};
	}) {
		this._provider = provider;
		this._client_id = client_id;
		this._client_secret = client_secret;
		this._scopes = scopes;
		this.urls = urls;
		this._userInfo = userInfo;
	}

	private get redirect_uri(): URL {
		return new URL(this._provider, env.OAUTH_REDIRECT_URL);
	}

	private createState = (cookies: ReadonlyRequestCookies): string => {
		const state = crypto.randomBytes(64).toString("hex").normalize();
		cookies.set(env.STATE_COOKIE_KEY, state, {
			secure: true,
			httpOnly: true,
			sameSite: "lax",
			maxAge: Date.now() + env.COOKIE_EXPIRATION_SECONDS,
		});
		return state;
	};

	private createCodeVerifier = (cookies: ReadonlyRequestCookies): string => {
		const codeVerifier = crypto.randomBytes(64).toString("hex").normalize();
		cookies.set(env.CODE_VERIFIER_COOKIE_KEY, codeVerifier, {
			secure: true,
			httpOnly: true,
			sameSite: "lax",
			maxAge: Date.now() + env.COOKIE_EXPIRATION_SECONDS,
		});
		return codeVerifier;
	};

	private verifyState = async (state: string) => {
		const cookieStore = await cookies();
		const stateCookie = cookieStore.get(env.STATE_COOKIE_KEY)?.value;
		if (!stateCookie) throw new InvalidStateError();
		return state === stateCookie;
	};

	private getCodeVerifier = (cookies: ReadonlyRequestCookies) => {
		const codeVerifier = cookies.get(env.CODE_VERIFIER_COOKIE_KEY)?.value;
		if (!codeVerifier) throw new InvalidCodeVerifierError();
		return codeVerifier;
	};

	private async fetchToken(
		code: string,
		codeVerifier: string,
	): Promise<z.infer<typeof this._STokenSchema>> {
		const body = new URLSearchParams({
			client_id: this._client_id,
			client_secret: this._client_secret,
			grant_type: "authorization_code",
			code,
			redirect_uri: this.redirect_uri.toString(),
			code_verifier: codeVerifier,
		});
		const res = await fetch(this.urls.token, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				"User-Agent": "NextAuth-No-Lib/1.0",
				Accept: "application/json",
			},
			body,
		});
		console.log("OAuth Token Response:", res);
		if (!res.ok) {
			throw new Error(`Failed to fetch access token: ${res.status}`);
		}
		const data = await res.json();
		console.log("OAuth Token Data:", data);
		const {
			success,
			data: tokenData,
			error,
		} = this._STokenSchema.safeParse(data);
		if (!success) throw new InvalidTokenError(error);
		return tokenData;
	}

	createAuthUrl(cookies: ReadonlyRequestCookies): string {
		const state = this.createState(cookies);
		const codeVerifier = this.createCodeVerifier(cookies);
		const url = new URL(this.urls.auth);
		url.searchParams.set("client_id", this._client_id);
		url.searchParams.set("redirect_uri", this.redirect_uri.toString());
		url.searchParams.set("response_type", "code");
		url.searchParams.set("scope", this._scopes.join(" "));
		url.searchParams.set("state", state);
		url.searchParams.set("code_challenge_method", "S256");
		url.searchParams.set(
			"code_challenge",
			crypto.hash("sha256", codeVerifier, "base64url"),
		);
		return url.toString();
	}

	async fetchUser(
		code: string,
		state: string,
		cookies: ReadonlyRequestCookies,
	): Promise<{ id: string; name: string; email: string }> {
		const isValidState = await this.verifyState(state);
		if (!isValidState) throw new InvalidStateError();
		const token = await this.fetchToken(code, this.getCodeVerifier(cookies));
		const res = await fetch(this.urls.user, {
			headers: {
				Authorization: `${token.token_type} ${token.access_token}`,
			},
		});
		if (!res.ok) throw new Error(`Failed to fetch user info: ${res.status}`);
		const data = await res.json();
		console.log("OAuth User Data:", data);
		const {
			success,
			data: userData,
			error,
		} = this._userInfo.schema.safeParse(data);
		if (!success) throw new InvalidUserError(error);
		return this._userInfo.parser(userData);
	}
}

class InvalidTokenError extends Error {
	constructor(zodError: z.ZodError) {
		super("Invalid token");
		this.name = "InvalidTokenError";
		this.cause = zodError;
	}
}

class InvalidUserError extends Error {
	constructor(zodError: z.ZodError) {
		super("Invalid user data");
		this.name = "InvalidUserError";
		this.cause = zodError;
	}
}

class InvalidStateError extends Error {
	constructor() {
		super("Invalid state");
		this.name = "InvalidStateError";
	}
}

class InvalidCodeVerifierError extends Error {
	constructor() {
		super("Invalid code verifier");
		this.name = "InvalidCodeVerifierError";
	}
}
