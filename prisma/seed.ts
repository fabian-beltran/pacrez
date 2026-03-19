import prisma from "@/lib/prisma";

async function main() {
	const buildingsData = [
		{ name: "Grace Covell Hall", rooms: ["Ballroom", "Conference Room A", "Conference Room B"] },
		{ name: "Morris Chapel", rooms: ["Chapel", "Meditation Room"] },
		{ name: "Sears Hall", rooms: ["101", "102", "103"] },
		{ name: "Chambers Technology Center", rooms: ["Lab 1", "Lab 2", "Lab 3"] },
		{ name: "Wendell Philips Center", rooms: ["Auditorium", "Meeting Room 1"] },
		{ name: "William Knox Holt Memorial Library", rooms: ["Reading Room", "Study Room 1", "Study Room 2"] },
		{ name: "Baun Hall", rooms: ["201", "202"] },
		{ name: "Anderson Hall", rooms: ["101", "102"] },
		{ name: "Kourny Hall", rooms: ["Lab 1", "Lab 2"] },
		{ name: "Owen Hall", rooms: ["101", "102"] },
		{ name: "Weber Hall", rooms: ["Lecture Hall 1", "Lecture Hall 2"] },
		{ name: "Main Gym", rooms: ["Gym Floor", "Locker Room"] },
		{ name: "DeRosa University Center", rooms: ["Event Hall", "Meeting Room 1"] },
	];

	for (const buildingData of buildingsData) {
		const building = await prisma.building.upsert({
			where: { name: buildingData.name },
			update: {},
			create: { name: buildingData.name },
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
