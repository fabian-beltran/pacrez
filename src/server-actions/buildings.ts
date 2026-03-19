"use server";

import { Building, Room } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

export async function getBuildings(): Promise<(Building & { rooms: Room[] })[]> {
	return await prisma.building.findMany({
		include: {
			rooms: true,
		},
	});
}
