import { type NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const path = searchParams.get("path");

		if (!path) {
			return NextResponse.json(
				{ message: "パスが指定されていません" },
				{ status: 400 },
			);
		}

		revalidatePath(path);

		return NextResponse.json(
			{ revalidated: true, now: Date.now() },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Revalidation error:", error);
		return NextResponse.json(
			{ message: "再検証に失敗しました" },
			{ status: 500 },
		);
	}
}
