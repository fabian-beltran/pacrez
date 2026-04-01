"use server";
import { ReservationStatus, ReservationType } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { ReservationInput } from "@/lib/schemas/reservations";
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
}: ReservationInput) => {
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

export const getReservations = async (all?: boolean) => {
	const user = await requireUser();

	const reservations = await prisma.reservation.findMany({
		where: { userId: all && user.role === "ADMIN" ? undefined : user.id },
		include: { room: { include: { building: true } } },
		orderBy: { createdAt: "desc" },
	});

	return reservations;
};

export const updateReservation = async (
	reservationId: string,
	{
		startTime,
		endTime,
		reservationType,
		anticipatedAttendance,
		purpose,
		suppliesNeeded,
		contactName,
		contactEmail,
		contactPhone,
	}: ReservationInput
) => {
	const user = await requireUser();

	const existingReservation = await prisma.reservation.findUnique({
		where: { id: reservationId },
	});

	if (!existingReservation) {
		throw new Error("Reservation not found.");
	}

	if (existingReservation.userId !== user.id && user.role !== "ADMIN") {
		throw new Error("Unauthorized.");
	}

	const reservation = await prisma.reservation.update({
		where: { id: reservationId },
		data: {
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

export const updateReservationStatus = async (reservationId: string, status: ReservationStatus) => {
	const user = await requireUser();
	if (user.role !== "ADMIN") throw new Error("Unauthorized.");

	const updatedReservation = await prisma.reservation.update({
		where: { id: reservationId },
		data: {
			status,
			statusUpdatedAt: new Date(),
			statusUpdatedById: user.id,
		},
	});

	return updatedReservation;
};
