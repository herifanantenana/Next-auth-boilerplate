import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "./features/auth/core/session";

const privateRoutes = ["/private"];
const adminRoutes = ["/admin"];

const authentication = async (req: NextRequest) => {
	if (privateRoutes.includes(req.nextUrl.pathname)) {
		const user = await getUserSession();
		if (!user) return NextResponse.redirect(new URL("/sign-in", req.url));
	}

	if (adminRoutes.includes(req.nextUrl.pathname)) {
		const user = await getUserSession();
		if (!user || user.role !== "admin") {
			return NextResponse.redirect(new URL("/", req.url));
		}
	}
};

export const middleware = async (req: NextRequest) => {
	const res = (await authentication(req)) ?? NextResponse.next();
	return res;
};

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)"],
};
