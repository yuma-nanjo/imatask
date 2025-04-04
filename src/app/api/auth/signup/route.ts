import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Argon2id } from "oslo/password";

export async function POST(request: Request) {
	try {
		const { email, password, name } = await request.json();

		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			return NextResponse.json(
				{ error: "このメールアドレスは既に使用されています" },
				{ status: 400 },
			);
		}

		const hashedPassword = await new Argon2id().hash(password);

		await prisma.user.create({
			data: {
				email,
				name,
				hashedPassword,
			},
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Signup error:", error);
		return NextResponse.json(
			{ error: "サインアップ処理中にエラーが発生しました" },
			{ status: 500 },
		);
	}
}
