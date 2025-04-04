import { randomInt } from "node:crypto";

const CODE_EXPIRY_MINUTES = 10;

export function generateTwoFactorCode(): string {
	return randomInt(100000, 999999).toString();
}

export function generateBackupCodes(): string[] {
	return Array.from({ length: 10 }, () => randomInt(100000, 999999).toString());
}

export function verifyTwoFactorCode(
	storedCode: string,
	userCode: string,
	createdAt: Date,
): boolean {
	const now = new Date();
	const codeAge = (now.getTime() - createdAt.getTime()) / (1000 * 60);

	if (codeAge > CODE_EXPIRY_MINUTES) {
		return false;
	}

	return storedCode === userCode;
}
