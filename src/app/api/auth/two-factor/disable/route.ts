import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyTwoFactorCode } from "@/lib/twoFactor";

export async function POST(request: Request) {
	try {
		const cookieStore = await cookies();
		const sessionId = cookieStore.get(auth.sessionCookieName)?.value ?? null;
		if (!sessionId) {
			return NextResponse.json(
				{ error: "セッションが見つかりません" },
				{ status: 401 },
			);
		}

		const { user } = await auth.validateSession(sessionId);
		if (!user) {
			return NextResponse.json(
				{ error: "ユーザーが見つかりません" },
				{ status: 401 },
			);
		}

		const { code } = await request.json();
		const dbUser = await prisma.user.findUnique({
			where: { id: user.id },
		});

		if (!dbUser || !dbUser.twoFactorEnabled || !dbUser.twoFactorSecret) {
			return NextResponse.json(
				{ error: "2要素認証が有効化されていません" },
				{ status: 400 },
			);
		}

		if (!verifyTwoFactorCode(dbUser.twoFactorSecret, code, new Date())) {
			return NextResponse.json(
				{ error: "認証コードが正しくありません" },
				{ status: 400 },
			);
		}

		await prisma.user.update({
			where: { id: user.id },
			data: {
				twoFactorEnabled: false,
				twoFactorSecret: null,
				twoFactorBackupCodes: null,
			},
		});

		return NextResponse.json({
			success: true,
			message: "2要素認証を無効化しました",
		});
	} catch (error) {
		console.error("2FA disable error:", error);
		return NextResponse.json(
			{ error: "2要素認証の無効化中にエラーが発生しました" },
			{ status: 500 },
		);
	}
}
