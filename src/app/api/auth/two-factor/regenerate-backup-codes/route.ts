import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { generateBackupCodes } from "@/lib/twoFactor";
import { sendTwoFactorCode } from "@/lib/email";

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

		const backupCodes = generateBackupCodes();
		await prisma.user.update({
			where: { id: user.id },
			data: {
				twoFactorBackupCodes: JSON.stringify(backupCodes),
			},
		});

		await sendTwoFactorCode(user.email, backupCodes.join("\n"));

		return NextResponse.json({ success: true, backupCodes });
	} catch (error) {
		console.error("Backup codes regeneration error:", error);
		return NextResponse.json(
			{ error: "バックアップコードの再生成中にエラーが発生しました" },
			{ status: 500 },
		);
	}
}
