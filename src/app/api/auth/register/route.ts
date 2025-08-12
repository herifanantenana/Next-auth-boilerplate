import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schemas";
import { SessionTable } from "@/drizzle/schemas/session";
import { getDeviceInfo } from "@/features/auth/lib/device";
import { generateRandomByte, hashPassword } from "@/features/auth/lib/haser";
import { NextHttpResponse } from "@/lib/response/nextHttp";
import { S_User } from "@/types/user";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

/* _____ /API/AUTH/REGISTER POST ____ */
export async function POST(req: NextRequest) {
	const body = await req.json();
	/* Verify If User Exist ------------- */
	try {
		const existingUser = await db.query.UserTable.findFirst({
			where: eq(UserTable.email, body.email),
		});
		if (existingUser) return NextHttpResponse.conflict("Email already exists");
	} catch (error) {
		return NextHttpResponse.internalError("Failed to check for existing user");
	}

	/* Hash Password -------------------- */
	const salt = generateRandomByte(32);
	const hashedPassword = await hashPassword(body.password, salt);

	/* Parse Data User To Insert -------- */
	const {
		success,
		data: safeData,
		error,
	} = S_User.insert.safeParse({
		email: body.email,
		username: body.username,
		password: hashedPassword,
		salt,
	});
	if (!success || !safeData)
		return NextHttpResponse.badRequest("Invalid user data", error);

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
		const resTx = await db.transaction(async (tx) => {
			/* Insert User To Db ---------------- */
			const [newUser] = await tx
				.insert(UserTable)
				.values(safeData)
				.returning({ id: UserTable.id, role: UserTable.role });
			/* Create A New Session ------------- */
			const [newSession] = await tx
				.insert(SessionTable)
				.values({
					userId: newUser.id,
					sessionToken,
					...deviceInfoData,
				})
				.returning({
					id: SessionTable.id,
					sessionToken: SessionTable.sessionToken,
					expiredAt: SessionTable.expiredAt,
				});
			return {
				userId: newUser.id,
				userRole: newUser.role,
				sessionId: newSession.id,
				sessionToken: newSession.sessionToken,
				expiredAt: newSession.expiredAt,
			};
		});
		return NextHttpResponse.created(
			"User and session created successfully",
			resTx,
		);
	} catch (error) {
		return NextHttpResponse.internalError("Failed to create user", error);
	}
}
