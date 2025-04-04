import { PrismaClient } from "@prisma/client";

declare global {
	// eslint-disable-next-line no-var
	var db: PrismaClient | undefined;
}

export const prisma =
	global.db ??
	new PrismaClient({
		log: ["query", "error", "warn"],
	});

if (process.env.NODE_ENV !== "production") {
	global.db = prisma;
}

if (typeof window !== "undefined" || process.env.EDGE_RUNTIME) {
	throw new Error(
		"PrismaClientはエッジランタイムでは使用できません。Node.js環境でのみ使用してください。",
	);
}
