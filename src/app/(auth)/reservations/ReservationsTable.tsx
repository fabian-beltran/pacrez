"use client";
import { Table } from "@mantine/core";
import { Building, Reservation, Room } from "@/generated/prisma/browser";

const ReservationsTable = ({
	reservations,
}: {
	reservations: (Reservation & { room: Room & { building: Building } })[];
}) => {
	const rows = reservations.map((reservation) => (
		<Table.Tr key={reservation.id}>
			<Table.Td>
				{reservation.room.building.name} - {reservation.room.name}
			</Table.Td>
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
			<Table.Td>{reservation.anticipatedAttendance}</Table.Td>
			<Table.Td>{reservation.contactName}</Table.Td>
			<Table.Td>{reservation.contactEmail}</Table.Td>
			<Table.Td>{reservation.contactPhone}</Table.Td>
			<Table.Td>{reservation.status}</Table.Td>
		</Table.Tr>
	));
	return (
		<>
			<Table verticalSpacing="sm" withTableBorder>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Room Name</Table.Th>
						<Table.Th>Start Date</Table.Th>
						<Table.Th>End Date</Table.Th>
						<Table.Th>Type</Table.Th>
						<Table.Th>Attendance</Table.Th>
						<Table.Th>Contact Name</Table.Th>
						<Table.Th>Contact Email</Table.Th>
						<Table.Th>Contact Phone</Table.Th>
						<Table.Th>Status</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>{rows}</Table.Tbody>
			</Table>
		</>
	);
};

export default ReservationsTable;
