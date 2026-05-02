/* eslint-disable indent */
"use client";
import { useMemo, useState } from "react";
import { Table, TextInput, Select, Group, Stack } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import ReservationModal from "./ReservationModal";
import { Building, Reservation } from "@/lib/prisma-types";

const getSortValue = (r: Reservation, key: keyof Reservation) => {
	switch (key) {
		case "startTime":
		case "endTime":
			return new Date(r[key]).getTime();
		case "status":
		case "purpose":
		case "type":
		case "contactName":
			return String(r[key]).toLowerCase();
		default:
			return "";
	}
};

const ReservationsTable = ({ reservations, buildings }: { reservations: Reservation[]; buildings: Building[] }) => {
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState<string | null>("ALL");
	const [sortBy, setSortBy] = useState<keyof Reservation | null>("startTime");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

	const filteredReservations = useMemo(() => {
		const query = search.toLowerCase();

		let result = reservations.filter((r) => {
			const matchesStatus = status === "ALL" || !status ? true : r.status === status;

			const matchesSearch =
				r.purpose.toLowerCase().includes(query) ||
				r.room.name.toLowerCase().includes(query) ||
				r.room.building.name.toLowerCase().includes(query) ||
				r.contactName.toLowerCase().includes(query);

			return matchesStatus && matchesSearch;
		});

		if (sortBy) {
			result = [...result].sort((a, b) => {
				const aValue = getSortValue(a, sortBy);
				const bValue = getSortValue(b, sortBy);

				if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
				if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
				return 0;
			});
		}

		return result;
	}, [reservations, search, status, sortBy, sortDirection]);

	const getSortIcon = (field: keyof Reservation) => {
		const isActive = sortBy === field;

		return (
			<span style={{ marginLeft: 6, opacity: isActive ? 1 : 0.3 }}>
				{isActive && sortDirection === "asc" ? "▲" : "▼"}
			</span>
		);
	};

	const rows = filteredReservations.map((reservation) => (
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
		<Stack>
			<Group gap="xs">
				<ReservationModal buildings={buildings} />
				<TextInput
					placeholder="Search reservations..."
					leftSection={<IconSearch size={16} />}
					value={search}
					onChange={(e) => setSearch(e.currentTarget.value)}
					w={300}
				/>

				<Select
					value={status}
					onChange={setStatus}
					data={[
						{ value: "ALL", label: "All" },
						{ value: "PENDING", label: "Pending" },
						{ value: "APPROVED", label: "Approved" },
						{ value: "DENIED", label: "Denied" },
						{ value: "CANCELLED", label: "Cancelled" },
					]}
					w={180}
				/>
			</Group>

			<Table verticalSpacing="sm" withTableBorder>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Room Name</Table.Th>
						<Table.Th>Purpose</Table.Th>
						<Table.Th
							style={{ cursor: "pointer" }}
							onClick={() => {
								if (sortBy === "startTime") {
									setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
								} else {
									setSortBy("startTime");
									setSortDirection("asc");
								}
							}}
						>
							Start Time{getSortIcon("startTime")}
						</Table.Th>
						<Table.Th
							style={{ cursor: "pointer" }}
							onClick={() => {
								if (sortBy === "endTime") {
									setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
								} else {
									setSortBy("endTime");
									setSortDirection("asc");
								}
							}}
						>
							End Time{getSortIcon("endTime")}
						</Table.Th>
						<Table.Th>Type</Table.Th>
						<Table.Th>Contact Name</Table.Th>
						<Table.Th>Status</Table.Th>
						<Table.Th />
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>{rows}</Table.Tbody>
			</Table>
		</Stack>
	);
};

export default ReservationsTable;
