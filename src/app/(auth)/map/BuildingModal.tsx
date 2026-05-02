import ReservationModal from "@/components/ReservationModal";
import { Building } from "@/lib/prisma-types";
import { Group, Modal, Paper, Stack, Text, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const MapButton = ({
	label,
	top,
	left,
	onClick,
}: {
	label: string;
	top: string;
	left: string;
	onClick: () => void;
}) => {
	return (
		<UnstyledButton
			pos="absolute"
			top={top}
			left={left}
			style={{
				transform: "translate(-50%, -50%)",
				opacity: 0.9,
				fontSize: 8,
				color: "white",
				borderRadius: 2,
			}}
			bg="brand"
			p={3}
			onClick={onClick}
		>
			{label}
		</UnstyledButton>
	);
};

export default function BuildingModal({ building }: { building: Building }) {
	const [opened, { open, close }] = useDisclosure();
	return (
		<>
			<MapButton label={building.name} top={`${building.mapTop}%`} left={`${building.mapLeft}%`} onClick={open} />
			<Modal opened={opened} onClose={close} title={building.name}>
				<Stack gap={"xs"}>
					{building.rooms.map((r) => (
						<Paper key={r.id} p="xs" withBorder>
							<Group justify="space-between" align="center">
								<Text fw={500}>{r.name}</Text>
								<ReservationModal buildings={[]} selectedRoom={r} />
							</Group>
						</Paper>
					))}
				</Stack>
			</Modal>
		</>
	);
}
