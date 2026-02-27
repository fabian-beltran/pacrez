import { Title } from "@mantine/core";
import BookingsTable from "./ReservationsTable";
import CreateBookingModal from "./CreateReservationModal";
import { getBuildings } from "@/lib/server-actions/buildings";

export default async function ReservationsPage() {
	const buildings = await getBuildings();

	return (
		<>
			<Title mb="md">Your Reservations</Title>
			<CreateBookingModal buildings={buildings} />
			<BookingsTable />
		</>
	);
}
