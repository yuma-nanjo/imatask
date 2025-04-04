"use server";

import { cookies } from "next/headers";
import { cache } from "react";
import { auth } from "./auth";

export const validateRequest = cache(async () => {
	const cookieHeaders = await cookies();
	const sessionId = cookieHeaders.get(auth.sessionCookieName)?.value ?? null;
	if (!sessionId) {
		return {
			user: null,
			session: null,
		};
	}

	const result = await auth.validateSession(sessionId);
	try {
		if (result.session?.fresh) {
			const sessionCookie = auth.createSessionCookie(result.session.id);
			await cookieHeaders.set(
				sessionCookie.name,
				sessionCookie.value,
				sessionCookie.attributes,
			);
		}
		if (!result.session) {
			const sessionCookie = auth.createBlankSessionCookie();
			await cookieHeaders.set(
				sessionCookie.name,
				sessionCookie.value,
				sessionCookie.attributes,
			);
		}
	} catch {
		// Next.js throws when you attempt to set cookies when rendering page
	}
	return result;
});
