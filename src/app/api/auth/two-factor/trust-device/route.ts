import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

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

		const dbUser = await prisma.user.findUnique({
			where: { id: user.id },
		});

		if (!dbUser) {
			return NextResponse.json(
				{ error: "ユーザーが見つかりません" },
				{ status: 401 },
			);
		}

		const currentDevices = JSON.parse(dbUser.trustedDevices || "[]");
		currentDevices.push(new Date().toISOString());

		await prisma.user.update({
			where: { id: user.id },
			data: {
				trustedDevices: JSON.stringify(currentDevices),
			},
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Trust device error:", error);
		return NextResponse.json(
			{ error: "デバイスの信頼設定中にエラーが発生しました" },
			{ status: 500 },
		);
	}
}
