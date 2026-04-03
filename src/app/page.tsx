import LoginForm from "@/components/LoginForm";
import { getCurrentUser } from "@/server-actions/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
	const user = await getCurrentUser();
	if (user) redirect(user.role === "ADMIN" ? "/admin" : "/reservations");

	return <LoginForm />;
}
