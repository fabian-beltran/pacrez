import { Reservation } from "@/lib/prisma-types";
import { updateReservationStatus } from "@/server-actions/reservations";
import { ActionIcon, Button, Group, Modal, Text, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function CancelReservationModal({
	reservation,
	onCloseParent,
	loading,
}: {
	reservation: Reservation;
	onCloseParent: () => void;
	loading: boolean;
}) {
	const [opened, { open, close }] = useDisclosure();
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const handleCancelReservation = () => {
		startTransition(async () => {
			try {
				await updateReservationStatus(reservation.id, "CANCELLED");
				router.refresh();
				close();
				onCloseParent();
			} catch (error) {
				console.error(error);
			}
		});
	};

	return (
		<>
			<Tooltip label="Cancel Reservation">
				<ActionIcon onClick={open} variant="transparent" c="red" loading={loading}>
					<IconTrash />
				</ActionIcon>
			</Tooltip>
			<Modal opened={opened} onClose={close} title="Cancel Reservation">
				<Text>
					Are you sure you want to cancel reservation for <strong>{reservation.purpose}</strong>? This action
					cannot be undone.
				</Text>
				<Group gap="xs" mt="xs">
					<Button variant="outline" onClick={handleCancelReservation} loading={isPending}>
						Yes
					</Button>
					<Button onClick={close}>No</Button>
				</Group>
			</Modal>
		</>
	);
}
