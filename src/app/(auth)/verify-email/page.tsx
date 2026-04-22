import VerifyEmailForm from "./VerifyEmailForm";
import { getCurrentUser } from "@/server-actions/auth";
import { redirect } from "next/navigation";

export default async function VerifyEmailPage() {
	const user = await getCurrentUser();
	if (user?.isEmailVerified) redirect("/reservations");

	return <VerifyEmailForm />;
}
