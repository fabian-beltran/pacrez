import { Text, Paper, SimpleGrid, Title } from "@mantine/core";
import BookingsTable from "../(auth)/reservations/ReservationsTable";
import { requireUser } from "@/lib/helpers/authHelpers";

const StatCard = ({ label, value }: { label: string; value: string }) => {
	return (
		<Paper withBorder p="xs">
			<Text ta="center" fw="bold" size="xl">
				{label}
			</Text>
			<Text ta="center" size="xl">
				{value}
			</Text>
		</Paper>
	);
};

export default async function AdminPage() {
	await requireUser("/", ["ADMIN"]);

	return (
		<>
			<SimpleGrid cols={{ base: 1, lg: 4 }} mb="lg">
				<StatCard label="Pending Requests" value="20" />
				<StatCard label="Approved Today" value="12" />
				<StatCard label="Upcoming Reservations" value="54" />
				<StatCard label="Total Rooms" value="500" />
			</SimpleGrid>
			<Title ta="center" mb="sm">
				Recent Reservations
			</Title>
			<BookingsTable />
		</>
	);
}
