import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth.server";
import { prisma } from "@/lib/db";

export async function GET() {
	try {
		const { user } = await validateRequest();
		if (!user) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const tasks = await prisma.task.findMany({
			where: {
				userId: user.id,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return NextResponse.json(tasks);
	} catch (error) {
		console.error("Failed to fetch tasks:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}

export async function POST(request: Request) {
	try {
		const { user } = await validateRequest();
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { title, description, dueDate, priority, status } = body;

		const task = await prisma.task.create({
			data: {
				title,
				description,
				dueDate: dueDate ? new Date(dueDate) : null,
				priority,
				status,
				userId: user.id,
			},
		});

		return NextResponse.json(task);
	} catch (error) {
		console.error("Failed to create task:", error);
		return NextResponse.json(
			{ error: "Failed to create task" },
			{ status: 500 },
		);
	}
}
