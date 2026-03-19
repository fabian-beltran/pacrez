import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server-actions/auth";
import { Role } from "@/generated/prisma/enums";

/**
 * Fetches the current user and redirects if not logged in.
 * @param redirectTo - path to redirect if unauthenticated
 * @param roles- roles needed to access the page
 */
export async function requireUser(redirectTo = "/", roles?: Role[]) {
	const user = await getCurrentUser();
	if (!user) redirect(redirectTo);

	if (roles && !roles.includes(user.role)) redirect(redirectTo);

	return user;
}
