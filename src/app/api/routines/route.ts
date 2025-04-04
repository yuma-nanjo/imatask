import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth.server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
	try {
		const { user } = await validateRequest();
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { title, description, frequency, priority, estimatedTime } = body;

		const routine = await prisma.routine.create({
			data: {
				title,
				description,
				frequency,
				priority,
				estimatedTime,
				userId: user.id,
			},
		});

		return NextResponse.json(routine);
	} catch (error) {
		console.error("Failed to create routine:", error);
		return NextResponse.json(
			{ error: "Failed to create routine" },
			{ status: 500 },
		);
	}
}
