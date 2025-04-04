import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST() {
	try {
		const cookieStore = await cookies();
		const sessionId = cookieStore.get(auth.sessionCookieName)?.value ?? null;
		if (sessionId) {
			await auth.invalidateSession(sessionId);
		}

		const sessionCookie = auth.createBlankSessionCookie();
		await cookieStore.set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes,
		);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Logout error:", error);
		return NextResponse.json(
			{ error: "ログアウト処理中にエラーが発生しました" },
			{ status: 500 },
		);
	}
}
