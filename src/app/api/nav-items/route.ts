import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth.server";
import { prisma } from "@/lib/db";

export async function GET() {
	try {
		const { user } = await validateRequest();
		if (!user) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const navItems = await prisma.navItem.findMany({
			where: {
				userId: user.id,
			},
			orderBy: {
				order: "asc",
			},
		});

		return NextResponse.json(navItems);
	} catch (error) {
		console.error("Failed to fetch nav items:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
