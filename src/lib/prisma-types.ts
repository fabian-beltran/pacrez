import { BuildingGetPayload, ReservationCommentGetPayload, ReservationGetPayload } from "@/generated/prisma/models";

export type Reservation = ReservationGetPayload<{ include: { room: { include: { building: true } } } }> & {
	comments: ReservationComment[];
};
export type Building = BuildingGetPayload<{ include: { rooms: true } }>;
export type ReservationComment = ReservationCommentGetPayload<{ include: { user: true } }> & {
	replies: ReservationComment[];
};
