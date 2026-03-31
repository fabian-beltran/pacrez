import { Title } from "@mantine/core";
import ReservationsTable from "../../../components/ReservationsTable";
import ReservationModal from "../../../components/ReservationModal";
import { getBuildings } from "@/server-actions/buildings";
import { getReservations } from "@/server-actions/reservations";

export default async function ReservationsPage() {
	const buildings = await getBuildings();
	const reservations = await getReservations();

	return (
		<>
			<Title mb="md">Your Reservations</Title>
			<ReservationModal buildings={buildings} />
			<ReservationsTable reservations={reservations} />
		</>
	);
}
