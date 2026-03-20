import { Title } from "@mantine/core";
import ReservationsTable from "./ReservationsTable";
import CreateBookingModal from "./CreateReservationModal";
import { getBuildings } from "@/server-actions/buildings";
import { getReservations } from "@/server-actions/reservations";

export default async function ReservationsPage() {
	const buildings = await getBuildings();
	const reservations = await getReservations();

	return (
		<>
			<Title mb="md">Your Reservations</Title>
			<CreateBookingModal buildings={buildings} />
			<ReservationsTable reservations={reservations} />
		</>
	);
}
