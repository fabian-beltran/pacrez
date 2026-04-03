"use client";
import { Table } from "@mantine/core";
import ReservationModal from "./ReservationModal";
import { Reservation } from "@/lib/prisma-types";

const ReservationsTable = ({ reservations }: { reservations: Reservation[] }) => {
	const rows = reservations.map((reservation) => (
		<Table.Tr key={reservation.id}>
			<Table.Td>
				{reservation.room.building.name} - {reservation.room.name}
			</Table.Td>
			<Table.Td>{reservation.purpose}</Table.Td>
			<Table.Td>
				{reservation.startTime.toLocaleString([], {
					month: "short",
					day: "numeric",
					hour: "numeric",
					minute: "2-digit",
				})}
			</Table.Td>
			<Table.Td>
				{reservation.endTime.toLocaleString([], {
					month: "short",
					day: "numeric",
					hour: "numeric",
					minute: "2-digit",
				})}
			</Table.Td>
			<Table.Td>{reservation.type}</Table.Td>
			<Table.Td>{reservation.contactName}</Table.Td>
			<Table.Td
				c={reservation.status === "APPROVED" ? "green" : reservation.status === "DENIED" ? "red" : undefined}
				fw={["APPROVED", "DENIED"].includes(reservation.status) ? 700 : undefined}
			>
				{reservation.status}
			</Table.Td>
			<Table.Td>
				<ReservationModal buildings={[]} reservation={reservation} />
			</Table.Td>
		</Table.Tr>
	));
	return (
		<>
			<Table verticalSpacing="sm" withTableBorder>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Room Name</Table.Th>
						<Table.Th>Purpose</Table.Th>
						<Table.Th>Start Time</Table.Th>
						<Table.Th>End Time</Table.Th>
						<Table.Th>Type</Table.Th>
						<Table.Th>Contact Name</Table.Th>
						<Table.Th>Status</Table.Th>
						<Table.Th></Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>{rows}</Table.Tbody>
			</Table>
		</>
	);
};

export default ReservationsTable;
