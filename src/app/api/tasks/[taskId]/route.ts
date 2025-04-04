import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth.server";
import { prisma } from "@/lib/db";

export async function PATCH(
	request: Request,
	{ params }: { params: { taskId: string } },
) {
	try {
		const { user } = await validateRequest();
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { status, startTime, endTime, duration, ...updates } = body;

		const task = await prisma.task.update({
			where: {
				id: params.taskId,
				userId: user.id,
			},
			data: {
				status,
				...(startTime && { startTime: new Date(startTime) }),
				...(endTime && { endTime: new Date(endTime) }),
				...(duration && { duration: Number(duration) }),
				...updates,
			},
		});

		return NextResponse.json(task);
	} catch (error) {
		console.error("Failed to update task:", error);
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "タスクの更新に失敗しました" },
			{ status: 500 },
		);
	}
}
