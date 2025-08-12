"use server";

import { env } from "@/lib/env/client";
import { SA_Response, T_SA_Response } from "@/lib/response/action";
import { T_NextHttpResponse } from "@/lib/response/http";
import { T_Session } from "@/types/session";
import { S_User, T_User } from "@/types/user";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { createRedisUserSession, deleteCurrentSession } from "./session";
/* _______ REGISTER A NEW USER ______ */
export const SA_Register = async (
	unsafeData: T_User<"register">,
): Promise<T_SA_Response> => {
	/* Parse FormData ------------------- */
	const {
		success: successFormData,
		data: safeFormData,
		error: errorFormData,
	} = S_User.register.safeParse(unsafeData);
	if (!successFormData) {
		return SA_Response.parseZodError(
			"Invalid registration data. Please check your input and try again.",
			errorFormData,
		);
	}

	/* Create User And Session On Db ---- */
	const res = await fetch(`${env.NEXT_PUBLIC_APP_BASE_URL}/api/auth/register`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(safeFormData),
	});
	const body: T_NextHttpResponse<T_Session<"insertRedis">> = await res.json();
	if (!res.ok || !body.data)
		return SA_Response.error(`${body.type}: ${body.message}`);

	/* Create Session On Redis ---------- */
	try {
		await createRedisUserSession(body.data);
	} catch (error) {
		if (error instanceof ZodError)
			return SA_Response.parseZodError(
				"Invalid session data. Please try again.",
				error,
			);
		return SA_Response.error("Failed to create session. Please try again.");
	}
	return SA_Response.success(body.message, body.data);
};

/* _______ AUTHENTICATE A USER ______ */
export const SA_Login = async (
	unsafeData: T_User<"login">,
): Promise<T_SA_Response> => {
	/* Parse FormData ------------------- */
	const {
		success: successFormData,
		data: safeFormData,
		error: errorFormData,
	} = S_User.login.safeParse(unsafeData);
	if (!successFormData) {
		return SA_Response.parseZodError(
			"Invalid login data. Please check your input and try again.",
			errorFormData,
		);
	}

	/* Create Session On Db ------------- */
	const res = await fetch(`${env.NEXT_PUBLIC_APP_BASE_URL}/api/auth/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(safeFormData),
	});
	const body: T_NextHttpResponse<T_Session<"insertRedis">> = await res.json();
	if (!res.ok || !body.data)
		return SA_Response.error(`${body.type}: ${body.message}`);

	/* Create Session On Redis ---------- */
	try {
		await createRedisUserSession(body.data);
	} catch (error) {
		if (error instanceof ZodError)
			return SA_Response.parseZodError(
				"Invalid session data. Please try again.",
				error,
			);
		return SA_Response.error("Failed to create session. Please try again.");
	}
	return SA_Response.success(body.message);
};

/* ___________ LOGOUT USER __________ */
export const SA_Logout = async () => {
	try {
		await deleteCurrentSession();
		redirect("/");
	} catch (error) {
		return SA_Response.error("Failed to logout. Please try again.");
	}
};
