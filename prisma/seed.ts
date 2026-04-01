import prisma from "@/lib/prisma";

async function main() {
	const buildingsData = [
		{
			name: "Grace Covell Hall",
			rooms: ["Ballroom", "Conference Room A", "Conference Room B"],
			mapTop: 46,
			mapLeft: 79.5,
		},
		{ name: "Morris Chapel", rooms: ["Chapel", "Meditation Room"], mapTop: 46, mapLeft: 87 },
		{ name: "Sears Hall", rooms: ["101", "102", "103"], mapTop: 50, mapLeft: 60 },
		{ name: "Chambers Technology Center", rooms: ["Lab 1", "Lab 2", "Lab 3"], mapTop: 64.5, mapLeft: 62 },
		{ name: "Wendell Philips Center", rooms: ["Auditorium", "Meeting Room 1"], mapTop: 65, mapLeft: 54.5 },
		{
			name: "William Knox Holt Memorial Library",
			rooms: ["Reading Room", "Study Room 1", "Study Room 2"],
			mapTop: 63,
			mapLeft: 79,
		},
		{ name: "Baun Hall", rooms: ["201", "202"], mapTop: 55, mapLeft: 65.5 },
		{ name: "Anderson Hall", rooms: ["101", "102"], mapTop: 56, mapLeft: 69 },
		{ name: "Kourny Hall", rooms: ["Lab 1", "Lab 2"], mapTop: 60.5, mapLeft: 65 },
		{ name: "Owen Hall", rooms: ["101", "102"], mapTop: 53, mapLeft: 54 },
		{ name: "Weber Hall", rooms: ["Lecture Hall 1", "Lecture Hall 2"], mapTop: 51.5, mapLeft: 83.5 },
		{ name: "Main Gym", rooms: ["Gym Floor", "Locker Room"], mapTop: 56, mapLeft: 54 },
		{ name: "DeRosa University Center", rooms: ["Event Hall", "Meeting Room 1"], mapTop: 41, mapLeft: 61 },
	];

	for (const buildingData of buildingsData) {
		const building = await prisma.building.upsert({
			where: { name: buildingData.name },
			update: {},
			create: { name: buildingData.name, mapTop: buildingData.mapTop, mapLeft: buildingData.mapLeft },
		});

		for (const roomName of buildingData.rooms) {
			await prisma.room.upsert({
				where: { buildingId_name: { buildingId: building.id, name: roomName } },
				update: {},
				create: {
					name: roomName,
					capacity: Math.floor(Math.random() * 50) + 10, // random capacity 10–60
					description: `Room ${roomName} in ${building.name}`,
					buildingId: building.id,
				},
			});
		}
	}

	console.log("✅ Buildings and rooms seeded successfully!");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
