"use server";
import { ReservationStatus, ReservationType } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { ReservationInput } from "@/lib/schemas/reservations";
import { requireUser } from "./auth";
import { sendEmail } from "@/lib/email";
import { Reservation } from "@/lib/prisma-types";

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

	try {
		await sendEmail({
			to: user.email,
			subject: "Reservation Confirmed",
			html: `
				<h2>Reservation Confirmed</h2>
				<p>Your reservation has been successfully created.</p>
				
				<h3>Details:</h3>
				<ul>
					<li><strong>Room:</strong> ${room.name}</li>
					<li><strong>Building:</strong> ${room.building.name}</li>
					<li><strong>Start:</strong> ${new Date(startTime).toLocaleString()}</li>
					<li><strong>End:</strong> ${new Date(endTime).toLocaleString()}</li>
					<li><strong>Type:</strong> ${reservationType}</li>
					<li><strong>Attendance:</strong> ${anticipatedAttendance}</li>
				</ul>

				<p>If you have any questions, contact us.</p>
			`,
		});
	} catch (err) {
		console.error("Email failed:", err);
	}

	return { success: true, reservationId: reservation.id };
};

export const getReservations = async (all?: boolean) => {
	const user = await requireUser();

	const reservations = await prisma.reservation.findMany({
		where: { userId: all && user.role === "ADMIN" ? undefined : user.id },
		include: {
			room: { include: { building: true } },
			comments: { include: { user: true, replies: { include: { user: true } } } },
		},
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
		include: { user: true, room: { include: { building: true } } },
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

	try {
		await sendEmail({
			to: existingReservation.user.email,
			subject: "Reservation Updated",
			html: `
				<h2>Your Reservation Was Updated</h2>
				<p>Your reservation has been successfully updated.</p>

				<h3>Updated Details:</h3>
				<ul>
					<li><strong>Room:</strong> ${existingReservation.room.name}</li>
					<li><strong>Building:</strong> ${existingReservation.room.building.name}</li>
					<li><strong>Start:</strong> ${new Date(startTime).toLocaleString()}</li>
					<li><strong>End:</strong> ${new Date(endTime).toLocaleString()}</li>
					<li><strong>Type:</strong> ${reservationType}</li>
					<li><strong>Attendance:</strong> ${anticipatedAttendance}</li>
				</ul>

				<p>If you did not request this change, please contact us immediately.</p>
			`,
		});
	} catch (err) {
		console.error("Update email failed:", err);
	}

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
		include: { user: true, room: { include: { building: true } } },
	});

	try {
		const format = (date: Date) =>
			new Date(date).toLocaleString("en-US", {
				dateStyle: "medium",
				timeStyle: "short",
			});

		let message = "";

		if (status === "APPROVED") {
			// eslint-disable-next-line quotes
			message = `<p>Your reservation has been <strong style="color:green;">approved</strong>.</p>`;
		} else if (status === "DENIED") {
			// eslint-disable-next-line quotes
			message = `<p>Your reservation has been <strong style="color:red;">denied</strong>.</p>`;
		} else {
			message = `<p>Your reservation status has been updated to <strong>${status}</strong>.</p>`;
		}

		await sendEmail({
			to: updatedReservation.user.email,
			subject: `Reservation ${status}`,
			html: `
				<h2>Reservation Status Update</h2>
				${message}

				<h3>Reservation Details:</h3>
				<ul>
					<li><strong>Room:</strong> ${updatedReservation.room.name}</li>
					<li><strong>Building:</strong> ${updatedReservation.room.building.name}</li>
					<li><strong>Start:</strong> ${format(updatedReservation.startTime)}</li>
					<li><strong>End:</strong> ${format(updatedReservation.endTime)}</li>
				</ul>

				<p>If you have any questions, please contact us.</p>
			`,
		});
	} catch (err) {
		console.error("Status email failed:", err);
	}

	return updatedReservation;
};

export const createReservationComment = async (reservationId: string, content: string, parentId?: string) => {
	const user = await requireUser();

	const comment = await prisma.reservationComment.create({
		data: {
			reservationId,
			userId: user.id,
			content,
			parentId: parentId ?? null,
		},
		include: {
			user: true,
			replies: true,
			parent: { include: { user: true, reservation: { include: { room: { include: { building: true } } } } } },
		},
	});

	const reservation = await prisma.reservation.findUnique({
		where: { id: reservationId },
		include: {
			user: true,
			room: {
				include: {
					building: true,
				},
			},
		},
	});

	try {
		if (
			reservation &&
			reservation.user.id !== user.id // don't email yourself
		) {
			await sendEmail({
				to: reservation.user.email,
				subject: "New comment on your reservation",
				html: `
					<h2>New Comment</h2>
					<p><strong>${user.firstName || user.email}</strong> commented on your reservation.</p>

					<p><strong>Comment:</strong></p>
					<p>${content}</p>

					<h3>Reservation:</h3>
					<ul>
						<li><strong>Room:</strong> ${reservation.room.name}</li>
						<li><strong>Building:</strong> ${reservation.room.building.name}</li>
					</ul>
				`,
			});
		}
		if (parentId) {
			const parentComment = comment.parent;
			if (parentComment && parentComment.user.id !== user.id) {
				await sendEmail({
					to: parentComment.user.email,
					subject: "New reply to your comment",
					html: `
						<h2>You have a new reply</h2>

						<p><strong>${user.firstName || "Someone"}</strong> replied to your comment:</p>

						<blockquote style="border-left:4px solid #ccc; padding-left:10px;">
							${parentComment.content}
						</blockquote>

						<p><strong>Reply:</strong></p>
						<p>${content}</p>

						<h3>Reservation:</h3>
						<ul>
							<li><strong>Room:</strong> ${parentComment.reservation.room.name}</li>
							<li><strong>Building:</strong> ${parentComment.reservation.room.building.name}</li>
						</ul>

						<p>Log in to view the full conversation.</p>
					`,
				});
			}
		}
	} catch (error) {
		console.error("Error sending comment email", error);
	}

	return comment;
};
