import { NavLink } from "@mantine/core";
import { IconList, IconMap } from "@tabler/icons-react";
import Link from "next/link";

const Navbar = () => {
	return (
		<>
			<NavLink label="Bookings" py="md" leftSection={<IconList />} component={Link} href="/bookings" />
			<NavLink label="Campus Map" py="md" leftSection={<IconMap />} component={Link} href="/map" />
		</>
	);
};

export default Navbar;
