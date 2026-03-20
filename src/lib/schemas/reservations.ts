import * as z from "zod";

export const createReservationSchema = z
	.object({
		buildingName: z.string().min(1, "Please select a building."),
		roomName: z.string().min(1, "Please select a room."),
		startTime: z.coerce.date(),
		endTime: z.coerce.date(),
		reservationType: z.string().min(1, "Please select a reservation type."),
		anticipatedAttendance: z.int().min(1),
		purpose: z.string().min(1, "Please enter the purpose of this reservation."),
		suppliesNeeded: z.string(),
		contactName: z.string().min(1, "Please enter a contact name."),
		contactEmail: z.email(),
		contactPhone: z.string().min(1, "Please enter a contact phone number."),
	})
	.refine((data) => data.endTime > data.startTime, {
		message: "End time must be after start time",
		path: ["endTime"],
	});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;
