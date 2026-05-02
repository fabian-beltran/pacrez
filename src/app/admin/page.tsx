import { Text, Paper, SimpleGrid, Title } from "@mantine/core";
import ReservationsTable from "../../components/ReservationsTable";
import { requireUser } from "@/lib/helpers/authHelpers";
import { getReservations } from "@/server-actions/reservations";
import { getRoomCount } from "@/server-actions/buildings";

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
	const reservations = await getReservations(true);

	const pendingReservations = reservations.filter((r) => r.status === "PENDING");
	const approvedToday = reservations.filter(
		(r) =>
			r.status === "APPROVED" &&
			r.statusUpdatedAt &&
			// eslint-disable-next-line react-hooks/purity
			Date.now() - new Date(r.statusUpdatedAt).getTime() <= 86400000
	);
	const roomCount = await getRoomCount();

	const now = new Date().getTime();
	const in72Hours = now + 72 * 60 * 60 * 1000;

	const upcomingReservations = reservations.filter((r) => {
		if (!r.startTime) return false;
		const time = new Date(r.startTime).getTime();
		return time >= now && time <= in72Hours;
	});

	return (
		<>
			<SimpleGrid cols={{ base: 1, lg: 4 }} mb="lg">
				<StatCard label="Pending Reservations" value={pendingReservations.length.toString()} />
				<StatCard label="Approved Today" value={approvedToday.length.toString()} />
				<StatCard label="Upcoming Reservations" value={upcomingReservations.length.toString()} />
				<StatCard label="Total Rooms" value={roomCount.toString()} />
			</SimpleGrid>
			<Title ta="center" mb="sm">
				Recent Reservations
			</Title>
			<ReservationsTable reservations={reservations} />
		</>
	);
}
