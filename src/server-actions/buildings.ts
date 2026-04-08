"use server";

import prisma from "@/lib/prisma";
import { Room, Building } from "@/lib/prisma-types";

export async function getBuildings(): Promise<(Building & { rooms: Room[] })[]> {
	return await prisma.building.findMany({
		include: {
			rooms: { include: { building: true } },
		},
	});
}

export async function getRoomCount() {
	return await prisma.room.count();
}
