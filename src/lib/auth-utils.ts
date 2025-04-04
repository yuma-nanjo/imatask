import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15分

export async function checkLoginAttempts(userId: string): Promise<boolean> {
	const user = await client.user.findUnique({
		where: { id: userId },
		select: { loginAttempts: true, lastLoginAttempt: true },
	});

	if (!user) return true;

	const now = new Date();
	const lastAttempt = user.lastLoginAttempt
		? new Date(user.lastLoginAttempt)
		: null;

	if (lastAttempt && now.getTime() - lastAttempt.getTime() < LOCKOUT_DURATION) {
		if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
			return false;
		}
	} else {
		await client.user.update({
			where: { id: userId },
			data: { loginAttempts: 0 },
		});
	}

	return true;
}

export async function incrementLoginAttempts(userId: string): Promise<void> {
	await client.user.update({
		where: { id: userId },
		data: {
			loginAttempts: { increment: 1 },
			lastLoginAttempt: new Date(),
		},
	});
}

export async function resetLoginAttempts(userId: string): Promise<void> {
	await client.user.update({
		where: { id: userId },
		data: {
			loginAttempts: 0,
			lastLoginAttempt: null,
		},
	});
}
