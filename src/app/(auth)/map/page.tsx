import { getBuildings } from "@/server-actions/buildings";
import Map from "./Map";

export default async function CampusMap() {
	const buildings = await getBuildings();

	return <Map buildings={buildings} />;
}
