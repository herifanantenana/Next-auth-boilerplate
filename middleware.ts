import { NextRequest, NextResponse } from "next/server";
import { getUserSession, updateUserSessionExpiration } from "./features/auth/core/session";

const privateRoutes = ["/private"];
const adminRoutes = ["/admin"];

const authentication = async (req: NextRequest) => {
	if (privateRoutes.includes(req.nextUrl.pathname)) {
		const user = await getUserSession();
		if (!user) return NextResponse.redirect(new URL("/sign-in", req.url));
	}

	if (adminRoutes.includes(req.nextUrl.pathname)) {
		const user = await getUserSession();
		if (!user) return NextResponse.redirect(new URL("/sign-in", req.url));
		if (user.role !== "admin") {
			return NextResponse.redirect(new URL("/", req.url));
		}
	}
};

export const middleware = async (req: NextRequest) => {
	const res = (await authentication(req)) ?? NextResponse.next();
	await updateUserSessionExpiration();
	return res;
};

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)"],
};
