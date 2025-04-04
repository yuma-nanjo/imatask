import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/login", "/signup", "/auth/two-factor"];
const SESSION_COOKIE_NAME = "auth_session";

export async function middleware(request: NextRequest) {
	const sessionId = request.cookies.get(SESSION_COOKIE_NAME)?.value;

	if (!sessionId) {
		if (publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
			return NextResponse.next();
		}
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// ログイン済みユーザーがログインページなどにアクセスした場合はリダイレクト
	if (publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
