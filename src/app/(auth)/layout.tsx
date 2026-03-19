import { ReactNode } from "react";
import { requireUser } from "@/lib/helpers/authHelpers";

export default async function AuthLayout({ children }: { children: ReactNode }) {
	await requireUser();

	return <>{children}</>;
}
