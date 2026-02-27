import { Box, Divider, NavLink } from "@mantine/core";
import { IconList, IconMap, IconLogin } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavButton = ({ label, icon, href }: { label: string; icon: React.ReactElement; href: string }) => {
	const pathname = usePathname();
	const active = pathname === href;
	return (
		<NavLink
			label={label}
			py="sm"
			mb={6}
			style={{ borderRadius: 6 }}
			leftSection={icon}
			component={Link}
			href={href}
			active={active}
		/>
	);
};

const Navbar = () => {
	return (
		<Box p="xs">
			<NavButton label="Bookings" icon={<IconList />} href="/bookings" />
			<NavButton label="Campus Map" icon={<IconMap />} href="/map" />
			<Divider my={12} />
			<NavButton label="Login" icon={<IconLogin />} href="/" />
		</Box>
	);
};

export default Navbar;
