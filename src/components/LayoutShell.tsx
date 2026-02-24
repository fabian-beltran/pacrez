"use client";
import { MantineProvider, AppShell, Space } from "@mantine/core";
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
					width: 200,
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
					<Space h="xl" />
					{children}
				</AppShell.Main>
			</AppShell>
		</MantineProvider>
	);
};

export default LayoutShell;
