import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { Argon2id } from "oslo/password";
import { generateTwoFactorCode } from "@/lib/twoFactor";
import { sendTwoFactorCode } from "@/lib/email";

export async function POST(request: Request) {
	try {
		const { email, password } = await request.json();

		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			return NextResponse.json(
				{ error: "メールアドレスまたはパスワードが正しくありません" },
				{ status: 400 },
			);
		}

		const validPassword = await new Argon2id().verify(
			user.hashedPassword,
			password,
		);
		if (!validPassword) {
			return NextResponse.json(
				{ error: "メールアドレスまたはパスワードが正しくありません" },
				{ status: 400 },
			);
		}

		if (user.twoFactorEnabled) {
			const twoFactorCode = generateTwoFactorCode();
			await prisma.user.update({
				where: { id: user.id },
				data: { twoFactorSecret: twoFactorCode },
			});
			await sendTwoFactorCode(user.email, twoFactorCode);

			return NextResponse.json({
				success: true,
				requiresTwoFactor: true,
				message: "2要素認証コードをメールで送信しました",
			});
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
		console.error("Login error:", error);
		return NextResponse.json(
			{ error: "ログイン処理中にエラーが発生しました" },
			{ status: 500 },
		);
	}
}
