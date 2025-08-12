import { NextResponse } from "next/server";

export type T_NextHttpResponse<T> = {
	status: number;
	success: boolean;
	type: string;
	message: string;
	data?: T;
};


/* ___ CLASS TO BOOST NEXTRESPONSE __ */
export class NextHttpResponse {

	/* Send Response -------------------- */
	static json<T>(
		status: number,
		success: boolean,
		type: string,
		message: string,
		data?: T,
	) {
		return NextResponse.json(
			{
				status,
				success,
				type,
				message,
				data,
			},
			{
				status,
			},
		);
	}

	/* Status Code 200 ------------------ */
	static ok<T>(message = "Request successful", data?: T) {
		return this.json(200, true, "ok", message, data);
	}

	/* Status Code 201 ------------------ */
	static created<T>(message = "Resource created", data?: T) {
		return this.json(201, true, "created", message, data);
	}

	/* Status Code 400 ------------------ */
	static badRequest<T>(message = "Bad request", data?: T) {
		return this.json(400, false, "bad_request", message, data);
	}

	/* Status Code 401 ------------------ */
	static unauthorized<T>(message = "Unauthorized", data?: T) {
		return this.json(401, false, "unauthorized", message, data);
	}

	/* Status Code 403 ------------------ */
	static forbidden<T>(message = "Forbidden", data?: T) {
		return this.json(403, false, "forbidden", message, data);
	}

	/* Status Code 404 ------------------ */
	static notFound<T>(message = "Resource not found", data?: T) {
		return this.json(404, false, "not_found", message, data);
	}

	/* Status Code 409 ------------------ */
	static conflict<T>(message = "Conflict: resource already exists", data?: T) {
		return this.json(409, false, "conflict", message, data);
	}

	/* Status Code 500 ------------------ */
	static internalError<T>(message = "Internal server error", data?: T) {
		return this.json(500, false, "internal_error", message, data);
	}
}
