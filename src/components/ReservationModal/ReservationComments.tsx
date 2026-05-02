"use client";
import { useState } from "react";
import { Button, Textarea, Stack, Group, Text, Divider, ActionIcon } from "@mantine/core";
import { IconArrowBackUp } from "@tabler/icons-react";
import { createReservationComment } from "@/server-actions/reservations";
import { Reservation, ReservationComment, ReservationCommentReply } from "@/lib/prisma-types";
import { useAuth } from "@/context/AuthContext";

interface Props {
	reservation: Reservation;
	refresh: () => void;
}

export const ReservationComments = ({ reservation, refresh }: Props) => {
	console.log(reservation);
	const user = useAuth();
	const [commentText, setCommentText] = useState("");
	const [replyingTo, setReplyingTo] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async () => {
		if (!commentText.trim()) return;
		setLoading(true);
		try {
			await createReservationComment(reservation.id, commentText, replyingTo ?? undefined);
			setCommentText("");
			setReplyingTo(null);
			refresh();
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const renderComment = (comment: ReservationComment | ReservationCommentReply, level = 0) => (
		<Stack key={comment.id} ml={level * 20} gap={0}>
			<Group justify="space-between">
				<Text fw={500}>
					{comment.user.firstName} {comment.user.lastName}
				</Text>
				{level === 0 && (
					<ActionIcon size="sm" onClick={() => setReplyingTo(comment.id)}>
						<IconArrowBackUp />
					</ActionIcon>
				)}
			</Group>
			<Text>{comment.content}</Text>
			{"replies" in comment && comment.replies?.map((reply) => renderComment(reply, level + 1))}
		</Stack>
	);

	return (
		<Stack gap="sm" mt="md">
			<Divider label="Comments" />
			{reservation.comments && reservation.comments.length > 0 ? (
				reservation.comments.filter((c) => !c.parentId).map((c) => renderComment(c))
			) : (
				<Text c="dimmed">No comments yet.</Text>
			)}
			{user && (
				<Stack gap="xs" mt="sm">
					{replyingTo && (
						<Text size="sm" c="dimmed">
							Replying to a comment{" "}
							<Button variant="subtle" size="xs" onClick={() => setReplyingTo(null)}>
								Cancel
							</Button>
						</Text>
					)}
					<Textarea
						placeholder={replyingTo ? "Write a reply..." : "Write a comment..."}
						value={commentText}
						onChange={(e) => setCommentText(e.currentTarget.value)}
						minRows={2}
					/>
					<Button onClick={handleSubmit} loading={loading}>
						{replyingTo ? "Reply" : "Comment"}
					</Button>
				</Stack>
			)}
		</Stack>
	);
};
