import LayoutShell from "@/components/LayoutShell";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import "@mantine/core/styles.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "PacRez",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" {...mantineHtmlProps}>
			<head>
				<meta charSet="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />

				<ColorSchemeScript />
			</head>
			<body>
				<LayoutShell>{children}</LayoutShell>
			</body>
		</html>
	);
}
