import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyTwoFactorCode } from "@/lib/twoFactor";

export async function POST(request: Request) {
	try {
		const { email, code } = await request.json();

		const user = await prisma.user.findUnique({
			where: { email },
			select: {
				id: true,
				twoFactorEnabled: true,
				twoFactorSecret: true,
				updatedAt: true,
			},
		});

		if (!user?.twoFactorEnabled || !user?.twoFactorSecret) {
			return NextResponse.json(
				{ error: "2要素認証が有効化されていません" },
				{ status: 400 },
			);
		}

		if (!verifyTwoFactorCode(user.twoFactorSecret, code, user.updatedAt)) {
			return NextResponse.json(
				{ error: "認証コードが正しくありません" },
				{ status: 400 },
			);
		}

		const session = await auth.createSession(user.id, {});
		const sessionCookie = auth.createSessionCookie(session.id);
		const cookieStore = await cookies();
		await cookieStore.set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes,
		);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("2FA verification error:", error);
		return NextResponse.json(
			{ error: "2要素認証の検証中にエラーが発生しました" },
			{ status: 500 },
		);
	}
}
