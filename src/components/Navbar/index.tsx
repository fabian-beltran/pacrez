import { Box, Divider } from "@mantine/core";
import { IconList, IconMap, IconLogin, IconLayoutDashboard } from "@tabler/icons-react";
import NavButton from "./NavButton";
import LogoutButton from "./LogoutButton";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
	const user = useAuth();

	const loggedInButtons = user && (
		<>
			<NavButton label="Reservations" icon={<IconList />} href="/reservations" />
			<NavButton label="Campus Map" icon={<IconMap />} href="/map" />
			{user.role === "ADMIN" && <NavButton label="Admin" icon={<IconLayoutDashboard />} href="/admin" />}
			<Divider my={12} />
		</>
	);

	return (
		<Box p="xs">
			{loggedInButtons}

			{!user ? <NavButton label="Login" icon={<IconLogin />} href="/" /> : <LogoutButton />}
		</Box>
	);
};

export default Navbar;
