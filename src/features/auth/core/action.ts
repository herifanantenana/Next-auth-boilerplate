"use server";

import { env } from "@/lib/env/client";
import { T_NextHttpResponse } from "@/lib/response/nextHttp";
import { SA_Response, T_SA_Response } from "@/lib/response/serverAction";
import { S_User, T_User } from "@/types/user";


/* _______ REGISTER A NEW USER ______ */
export const SA_Register = async (
	unsafeData: T_User<"register">,
): Promise<T_SA_Response> => {

	/* Parse FormData ------------------- */
	const {
		success,
		data: safeData,
		error: errorData,
	} = S_User.register.safeParse(unsafeData);
	if (!success) {
		return SA_Response.parseZodError(
			"Invalid registration data. Please check your input and try again.",
			errorData,
		);
	}

	/* Create User And Session On Db ---- */
	const res = await fetch(`${env.NEXT_PUBLIC_APP_BASE_URL}/api/auth/register`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(safeData),
	});
	const body: T_NextHttpResponse<any> = await res.json();
	if (!res.ok) return SA_Response.error(`${body.type}: ${body.message}`);

	// todo: create session on redis
	/* Create Session On Redis ---------- */
	return SA_Response.success(body.message, body.data);
};
