import { Box, Group, Title } from "@mantine/core";
import Image from "next/image";
import logo from "@/../public/images/logo.png";

const AppHeader = () => {
	return (
		<Box px="lg" py="xs" h="100%">
			<Group align="center" h="100%">
				<Box component={Image} src={logo} alt="Logo" h="100%" w="auto" />
				<Title>PacRez</Title>
			</Group>
		</Box>
	);
};

export default AppHeader;
