"use client";
import { NavLink } from "@mantine/core";
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

export default NavButton;
