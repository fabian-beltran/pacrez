"use client";
import { MantineProvider, AppShell, Space } from "@mantine/core";
import AppHeader from "@/components/AppHeader";
import theme from "@/lib/theme";

const LayoutShell = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<MantineProvider theme={theme}>
			<AppShell padding="md" header={{ height: 70 }}>
				<AppShell.Header bg="brand">
					<AppHeader />
				</AppShell.Header>

				<AppShell.Main>
					<Space h="xl" />
					{children}
				</AppShell.Main>
			</AppShell>
		</MantineProvider>
	);
};

export default LayoutShell;
