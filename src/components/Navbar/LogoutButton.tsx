"use client";
import { NavLink } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { logoutAction } from "@/server-actions/auth";

export default function LogoutButton() {
	const handleClick = async () => {
		try {
			await logoutAction();
		} catch (error) {
			console.error(error);
		}
	};
	return (
		<NavLink
			label={"Logout"}
			py="sm"
			mb={6}
			style={{ borderRadius: 6 }}
			leftSection={<IconLogout />}
			onClick={handleClick}
		/>
	);
}
