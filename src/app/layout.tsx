import LayoutShell from "@/components/LayoutShell";
import { AuthProvider } from "@/context/AuthContext";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import type { Metadata } from "next";
import { getCurrentUser } from "@/server-actions/auth";

export const metadata: Metadata = {
	title: "PacRez",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const user = await getCurrentUser();
	return (
		<html lang="en" {...mantineHtmlProps}>
			<head>
				<meta charSet="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />

				<ColorSchemeScript />
			</head>
			<body>
				<AuthProvider user={user}>
					<LayoutShell>{children}</LayoutShell>
				</AuthProvider>
			</body>
		</html>
	);
}
