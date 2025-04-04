import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { generateTwoFactorCode } from "@/lib/twoFactor";

export async function POST() {
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

		const twoFactorCode = generateTwoFactorCode();
		await prisma.user.update({
			where: { id: user.id },
			data: {
				twoFactorEnabled: true,
				twoFactorSecret: twoFactorCode,
			},
		});

		return NextResponse.json({ success: true, code: twoFactorCode });
	} catch (error) {
		console.error("2FA enable error:", error);
		return NextResponse.json(
			{ error: "2要素認証の有効化中にエラーが発生しました" },
			{ status: 500 },
		);
	}
}
