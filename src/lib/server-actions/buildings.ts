"use server";

import { Building, Room } from "@/generated/prisma/client";

// Dummy Buildings with nested Rooms
const dummyBuildings: (Building & { rooms: Room[] })[] = [
	{
		id: "b1",
		name: "Engineering Hall",
		rooms: [
			{
				id: "r1",
				name: "Room 101",
				capacity: 30,
				description: "First floor, near the entrance",
				buildingId: "b1",
			},
			{
				id: "r2",
				name: "Room 102",
				capacity: 20,
				description: "Second floor, small lab",
				buildingId: "b1",
			},
		],
	},
	{
		id: "b2",
		name: "Science Center",
		rooms: [
			{
				id: "r3",
				name: "Lab 201",
				capacity: 25,
				description: "Chemistry lab with fume hood",
				buildingId: "b2",
			},
			{
				id: "r4",
				name: "Lab 202",
				capacity: 15,
				description: "Biology lab, microscopes available",
				buildingId: "b2",
			},
		],
	},
	{
		id: "b3",
		name: "Library",
		rooms: [
			{
				id: "r5",
				name: "Reading Room",
				capacity: 50,
				description: "Quiet space with tables and chairs",
				buildingId: "b3",
			},
			{
				id: "r6",
				name: "Conference Room",
				capacity: 12,
				description: "Small meeting room, projector included",
				buildingId: "b3",
			},
		],
	},
];

export async function getBuildings() {
	return dummyBuildings;
}
