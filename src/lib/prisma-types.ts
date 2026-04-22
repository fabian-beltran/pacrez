import {
	BuildingGetPayload,
	ReservationCommentGetPayload,
	ReservationGetPayload,
	RoomGetPayload,
} from "@/generated/prisma/models";

export type Reservation = ReservationGetPayload<{ include: { room: { include: { building: true } }; user: true } }> & {
	comments: ReservationComment[];
};
export type Building = BuildingGetPayload<{ include: { rooms: { include: { building: true } } } }>;
export type ReservationComment = ReservationCommentGetPayload<{ include: { user: true } }> & {
	replies: ReservationComment[];
};

export type Room = RoomGetPayload<{ include: { building: true } }>;
