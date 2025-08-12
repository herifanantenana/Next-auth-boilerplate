import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schemas";
import { SessionTable } from "@/drizzle/schemas/session";
import { getDeviceInfo } from "@/features/auth/lib/device";
import { generateRandomByte, verifyPassword } from "@/features/auth/lib/haser";
import { NextHttpResponse } from "@/lib/response/http";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
	const body = await req.json();
	let user;
	try {
		user = await db.query.UserTable.findFirst({
			columns: {
				id: true,
				password: true,
				salt: true,
				role: true,
			},
			where: eq(UserTable.email, body.email),
		});
		if (!user) return NextHttpResponse.notFound("User not found");
	} catch (error) {
		return NextHttpResponse.internalError("Failed to check for existing user");
	}

	/* Verify If User Log With Oauth ---- */
	if (!user.password || !user.salt || user.salt.length != 64)
		return NextHttpResponse.forbidden(
			"Please log in with your OAuth provider.",
		);

	/* Verify Is Password Correct ------- */
	const isValidPassword = await verifyPassword(
		body.password,
		user.salt,
		user.password,
	);
	if (!isValidPassword)
		return NextHttpResponse.unauthorized("Invalid email or password");

	/* Get Device And Browser Info ------ */
	const {
		success: deviceInfoSuccess,
		data: deviceInfoData,
		error: deviceInfoError,
	} = getDeviceInfo(req);
	if (!deviceInfoSuccess || !deviceInfoData) {
		return NextHttpResponse.badRequest("Invalid device info", deviceInfoError);
	}

	/* Create Session Token ------------ */
	const sessionToken = generateRandomByte(16);
	try {
		/* Create A New Session ------------- */
		const [newSession] = await db
			.insert(SessionTable)
			.values({
				userId: user.id,
				sessionToken,
				...deviceInfoData,
			})
			.returning({
				id: SessionTable.id,
				sessionToken: SessionTable.sessionToken,
				expiredAt: SessionTable.expiredAt,
			});
		return NextHttpResponse.created("Authentication successful", {
			userId: user.id,
			userRole: user.role,
			sessionId: newSession.id,
			sessionToken: newSession.sessionToken,
			expiredAt: newSession.expiredAt,
		});
	} catch (error) {
		return NextHttpResponse.internalError("Failed to create session", error);
	}
}
