import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth.server";

export async function POST() {
	try {
		const { user, session } = await validateRequest();

		if (!session || !user) {
			return NextResponse.json({ session: null, user: null }, { status: 200 });
		}

		return NextResponse.json(
			{
				session: {
					id: session.id,
					userId: session.userId,
					expiresAt: session.expiresAt,
				},
				user: {
					id: user.id,
					email: user.email,
					emailVerified: user.emailVerified,
					twoFactorEnabled: user.twoFactorEnabled,
				},
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("Session validation error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
