"use server";
import { ReservationType } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { CreateReservationInput } from "@/lib/schemas/reservations";
import { requireUser } from "./auth";

export const createReservation = async ({
	roomName,
	buildingName,
	startTime,
	endTime,
	reservationType,
	anticipatedAttendance,
	purpose,
	suppliesNeeded,
	contactName,
	contactEmail,
	contactPhone,
}: CreateReservationInput) => {
	console.log(startTime, endTime);
	const user = await requireUser();

	const room = await prisma.room.findFirst({
		where: {
			name: roomName,
			building: {
				name: buildingName,
			},
		},
		include: {
			building: true,
		},
	});

	if (!room) throw new Error("Room not found.");

	const reservation = await prisma.reservation.create({
		data: {
			userId: user.id,
			roomId: room.id,
			startTime: new Date(startTime),
			endTime: new Date(endTime),
			type: reservationType as ReservationType,
			anticipatedAttendance,
			purpose,
			suppliesNeeded,
			contactName,
			contactEmail,
			contactPhone,
		},
	});

	return { success: true, reservationId: reservation.id };
};

export const getReservations = async () => {
	const user = await requireUser();

	const reservations = await prisma.reservation.findMany({
		where: { userId: user.id },
		include: { room: { include: { building: true } } },
		orderBy: { createdAt: "desc" },
	});

	return reservations;
};
