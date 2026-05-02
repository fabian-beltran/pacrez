import {
	BuildingGetPayload,
	ReservationCommentGetPayload,
	ReservationGetPayload,
	RoomGetPayload,
} from "@/generated/prisma/models";

export type Reservation = ReservationGetPayload<{ include: { room: { include: { building: true } }; user: true } }> & {
	comments: ReservationComment[];
};

export type ReservationCommentReply = ReservationCommentGetPayload<{
	include: { user: true };
}>;

export type ReservationComment = ReservationCommentGetPayload<{
	include: { user: true };
}> & {
	replies: ReservationCommentReply[];
};

export type Building = BuildingGetPayload<{ include: { rooms: { include: { building: true } } } }>;
export type Room = RoomGetPayload<{ include: { building: true } }>;
