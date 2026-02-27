"use client";
import { MantineProvider, AppShell, Container } from "@mantine/core";
import AppHeader from "@/components/AppHeader";
import theme from "@/lib/theme";
import Navbar from "./Navbar";

const LayoutShell = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<MantineProvider theme={theme}>
			<AppShell
				padding="md"
				header={{ height: 70 }}
				navbar={{
					width: 240,
					breakpoint: "sm",
				}}
			>
				<AppShell.Header bg="brand">
					<AppHeader />
				</AppShell.Header>

				<AppShell.Navbar>
					<Navbar />
				</AppShell.Navbar>

				<AppShell.Main>
					<Container size="xl">{children}</Container>
				</AppShell.Main>
			</AppShell>
		</MantineProvider>
	);
};

export default LayoutShell;
