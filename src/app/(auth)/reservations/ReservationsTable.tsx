"use client";
import { Table } from "@mantine/core";
import { Reservation, ReservationStatus, ReservationType } from "@/generated/prisma/browser";

const BookingsTable = () => {
	const rows = dummyReservations.map((reservation: Reservation) => (
		<Table.Tr key={reservation.id}>
			<Table.Td>{reservation.roomId}</Table.Td>
			<Table.Td>{reservation.startTime.toDateString()}</Table.Td>
			<Table.Td>{reservation.endTime.toDateString()}</Table.Td>
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

export default BookingsTable;

const dummyReservations = [
	{
		id: "res_1",
		userId: "user_1",
		roomId: "room_101",
		startTime: new Date("2026-02-12T09:00:00"),
		endTime: new Date("2026-02-12T10:00:00"),
		type: ReservationType.STUDY,
		anticipatedAttendance: 52,
		purpose: "to study",
		suppliesNeeded: null,
		contactName: "Fabian Beltran",
		contactEmail: "f_beltran@u.pacific.edu",
		contactPhone: "(559) 395-3050",
		status: ReservationStatus.APPROVED,
		createdAt: new Date("2026-02-10T08:15:00"),
		updatedAt: new Date("2026-02-10T08:15:00"),
	},
	{
		id: "res_2",
		userId: "user_2",
		roomId: "room_101",
		startTime: new Date("2026-02-12T10:30:00"),
		endTime: new Date("2026-02-12T11:30:00"),
		type: ReservationType.STUDY,
		anticipatedAttendance: 52,
		purpose: "to study",
		suppliesNeeded: null,
		contactName: "Fabian Beltran",
		contactEmail: "f_beltran@u.pacific.edu",
		contactPhone: "(559) 395-3050",
		status: ReservationStatus.PENDING,
		createdAt: new Date("2026-02-11T09:00:00"),
		updatedAt: new Date("2026-02-11T09:00:00"),
	},
	{
		id: "res_3",
		userId: "user_3",
		roomId: "room_202",
		startTime: new Date("2026-02-13T13:00:00"),
		endTime: new Date("2026-02-13T15:00:00"),
		type: ReservationType.STUDY,
		anticipatedAttendance: 52,
		purpose: "to study",
		suppliesNeeded: null,
		contactName: "Fabian Beltran",
		contactEmail: "f_beltran@u.pacific.edu",
		contactPhone: "(559) 395-3050",
		status: ReservationStatus.APPROVED,
		createdAt: new Date("2026-02-11T14:20:00"),
		updatedAt: new Date("2026-02-11T14:20:00"),
	},
	{
		id: "res_4",
		userId: "user_1",
		roomId: "room_303",
		startTime: new Date("2026-02-14T08:00:00"),
		endTime: new Date("2026-02-14T09:30:00"),
		type: ReservationType.STUDY,
		anticipatedAttendance: 52,
		purpose: "to study",
		suppliesNeeded: null,
		contactName: "Fabian Beltran",
		contactEmail: "f_beltran@u.pacific.edu",
		contactPhone: "(559) 395-3050",
		status: ReservationStatus.CANCELLED,
		createdAt: new Date("2026-02-12T07:45:00"),
		updatedAt: new Date("2026-02-12T07:45:00"),
	},
	{
		id: "res_5",
		userId: "user_4",
		roomId: "room_101",
		startTime: new Date("2026-02-15T16:00:00"),
		endTime: new Date("2026-02-15T18:00:00"),
		type: ReservationType.STUDY,
		anticipatedAttendance: 52,
		purpose: "to study",
		suppliesNeeded: null,
		contactName: "Fabian Beltran",
		contactEmail: "f_beltran@u.pacific.edu",
		contactPhone: "(559) 395-3050",
		status: ReservationStatus.APPROVED,
		createdAt: new Date("2026-02-13T11:10:00"),
		updatedAt: new Date("2026-02-13T11:10:00"),
	},
];
