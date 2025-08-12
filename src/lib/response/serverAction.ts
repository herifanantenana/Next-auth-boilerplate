import { ZodError } from "zod";

interface I_SA_Success<T = any> {
	success: true;
	data: T;
	message?: string;
}

interface I_SA_Error {
	success: false;
	error: string;
	code?: string;
	details?: Record<string, any> | Record<string, any>[];
}

export type T_SA_Response<T = any> = I_SA_Success<T> | I_SA_Error;

/* __ CLASS TO BOOST SERVER ACTION __ */
export class SA_Response {

	/* On Success --------------------- */
	static success<T>(message: string, data: T): I_SA_Success<T> {
		return {
			success: true,
			message,
			data,
		};
	}

	/* On Error ------------------------- */
	static error(
		error: string,
		details?: Record<string, any>,
		code?: string,
	): I_SA_Error {
		return {
			success: false,
			error,
			code,
			details,
		};
	}

	/* Error From ZodError -------------- */
	static parseZodError(error: string, zodError: ZodError): I_SA_Error {
		const issues = zodError.issues.map((issue) => ({
			message: issue.code.split("_").join(" "),
			path: issue.path,
			code: issue.message,
		}));
		return this.error(error, issues, zodError.name);
	}
}
