"use client";
import {
	Button,
	Divider,
	Group,
	Modal,
	Select,
	NumberInput,
	Textarea,
	Autocomplete,
	Stack,
	TextInput,
	ActionIcon,
	Accordion,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { DateTimePicker } from "@mantine/dates";
import { ReservationType, ReservationStatus } from "@/generated/prisma/browser";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useForm } from "@mantine/form";
import { ReservationInput, reservationSchema } from "@/lib/schemas/reservations";
import { createReservation, updateReservation, updateReservationStatus } from "@/server-actions/reservations";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { IconEye } from "@tabler/icons-react";
import { useAuth } from "@/context/AuthContext";
import { Building, Reservation, Room } from "@/lib/prisma-types";
import { ReservationComments } from "./ReservationComments";
import CancelReservationModal from "./CancelReservationModal";

function getDefaultTimes() {
	const now = new Date();

	const start = new Date(now);
	start.setMinutes(0, 0, 0);
	start.setHours(start.getHours() + (now.getMinutes() > 0 ? 1 : 0));

	const end = new Date(start);
	end.setHours(end.getHours() + 1);

	return { start, end };
}

const reservationTypeOptions = Object.values(ReservationType).map((type) => ({
	value: type,
	label: type.charAt(0) + type.slice(1).toLowerCase(),
}));

const ReservationModal = ({
	buildings,
	reservation,
	selectedRoom,
}: {
	buildings: Building[];
	reservation?: Reservation;
	selectedRoom?: Room;
}) => {
	const user = useAuth();
	const { start, end } = getDefaultTimes();
	const router = useRouter();
	const [opened, { open, close }] = useDisclosure(false, { onClose: () => !reservation && form.reset() });
	const [isSubmitPending, startSubmitTransition] = useTransition();
	const [isStatusPending, startStatusTransition] = useTransition();
	const form = useForm<ReservationInput>({
		initialValues: {
			buildingName: "",
			roomName: "",
			startTime: start,
			endTime: end,
			reservationType: "",
			anticipatedAttendance: 1,
			purpose: "",
			suppliesNeeded: "",
			contactName: "",
			contactEmail: "",
			contactPhone: "",
		},
		validate: zod4Resolver(reservationSchema),
	});

	const handleSubmit = (values: ReservationInput) => {
		startSubmitTransition(async () => {
			try {
				if (!reservation) {
					await createReservation(values);
				} else {
					await updateReservation(reservation.id, values);
				}
				close();
				router.refresh();
				if (selectedRoom) {
					router.push("/reservations");
				}
			} catch (error) {
				console.error(error);
			}
		});
	};

	useEffect(() => {
		if (reservation) {
			form.setValues({
				buildingName: reservation.room.building.name,
				roomName: reservation.room.name,
				startTime: reservation.startTime,
				endTime: reservation.endTime,
				reservationType: reservation.type,
				anticipatedAttendance: reservation.anticipatedAttendance,
				purpose: reservation.purpose,
				suppliesNeeded: reservation.suppliesNeeded ?? "",
				contactName: reservation.contactName,
				contactEmail: reservation.contactEmail,
				contactPhone: reservation.contactPhone,
			});
		} else if (selectedRoom) {
			form.setValues({
				buildingName: selectedRoom.building.name,
				roomName: selectedRoom.name,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reservation?.id]);

	const handleStatusChange = (status: ReservationStatus) => {
		startStatusTransition(async () => {
			if (!reservation) return;
			try {
				await updateReservationStatus(reservation.id, status);
				router.refresh();
				close();
			} catch (error) {
				console.error(error);
			}
		});
	};

	return (
		<>
			{!reservation && <Button onClick={open}>Create Reservation</Button>}
			{reservation && (
				<ActionIcon variant="transparent" onClick={open}>
					<IconEye />
				</ActionIcon>
			)}

			<Modal
				opened={opened}
				onClose={close}
				title={reservation ? `Reservation - ${reservation.id}` : "Create Reservation"}
			>
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<Stack gap={"xs"}>
						<Autocomplete
							label="Building"
							placeholder="Select a building"
							data={buildings.map((b) => b.name)}
							{...form.getInputProps("buildingName")}
							onChange={(value) => {
								form.setFieldValue("buildingName", value);
								form.setFieldValue("roomName", "");
							}}
							readOnly={!!reservation || !!selectedRoom}
							styles={reservation || selectedRoom ? { input: { cursor: "not-allowed" } } : undefined}
							disabled={reservation?.status === "CANCELLED"}
						/>

						<Autocomplete
							label="Room"
							placeholder="Select a room"
							data={
								buildings.find((b) => b.name === form.values.buildingName)?.rooms.map((r) => r.name) ??
								[]
							}
							disabled={
								(!reservation && !form.values.buildingName) || reservation?.status === "CANCELLED"
							}
							{...form.getInputProps("roomName")}
							readOnly={!!reservation || !!selectedRoom}
							styles={reservation || selectedRoom ? { input: { cursor: "not-allowed" } } : undefined}
						/>

						<Group grow>
							<DateTimePicker
								label="Start Time"
								valueFormat="MMM DD, YYYY h:mm A"
								timePickerProps={{
									withDropdown: true,
									popoverProps: { withinPortal: false },
									format: "12h",
								}}
								{...form.getInputProps("startTime")}
								disabled={reservation?.status === "CANCELLED"}
							/>
							<DateTimePicker
								label="End Time"
								valueFormat="MMM DD, YYYY h:mm A"
								timePickerProps={{
									withDropdown: true,
									popoverProps: { withinPortal: false },
									format: "12h",
								}}
								{...form.getInputProps("endTime")}
								disabled={reservation?.status === "CANCELLED"}
							/>
						</Group>

						<Select
							label="Reservation Type"
							placeholder="Select a type"
							data={reservationTypeOptions}
							{...form.getInputProps("reservationType")}
							disabled={reservation?.status === "CANCELLED"}
						/>

						<NumberInput
							label="Anticipated Attendance"
							min={1}
							{...form.getInputProps("anticipatedAttendance")}
							disabled={reservation?.status === "CANCELLED"}
						/>

						<Textarea
							label="Purpose"
							{...form.getInputProps("purpose")}
							disabled={reservation?.status === "CANCELLED"}
						/>

						<Textarea
							label="Supplies Needed"
							{...form.getInputProps("suppliesNeeded")}
							disabled={reservation?.status === "CANCELLED"}
						/>

						<Divider mt="xs" />

						<TextInput
							label={
								<Group>
									<span>Contact Name</span>
									{user && (
										<Button
											variant="transparent"
											size="xs"
											onClick={() => {
												form.setFieldValue("contactName", `${user.firstName} ${user.lastName}`);
												form.setFieldValue("contactEmail", user.email);
												// form.setFieldValue("contactPhone", "");
											}}
										>
											insert my info
										</Button>
									)}
								</Group>
							}
							{...form.getInputProps("contactName")}
							disabled={reservation?.status === "CANCELLED"}
						/>
						<TextInput
							label="Contact Email"
							{...form.getInputProps("contactEmail")}
							disabled={reservation?.status === "CANCELLED"}
						/>
						<TextInput
							label="Contact Phone Number"
							{...form.getInputProps("contactPhone")}
							disabled={reservation?.status === "CANCELLED"}
						/>
					</Stack>

					{reservation && (
						<Accordion>
							<Accordion.Item value="Comments">
								<Accordion.Control>Comments</Accordion.Control>
								<Accordion.Panel>
									<ReservationComments reservation={reservation} refresh={router.refresh} />
								</Accordion.Panel>
							</Accordion.Item>
						</Accordion>
					)}

					<Group mt="lg" justify="space-between">
						{user?.role === "ADMIN" && reservation && (
							<Group gap="xs">
								<Button
									color="green"
									size="xs"
									onClick={() => handleStatusChange("APPROVED")}
									disabled={reservation.status === "APPROVED"}
									loading={isStatusPending}
								>
									Approve
								</Button>
								<Button
									color="red"
									size="xs"
									onClick={() => handleStatusChange("DENIED")}
									disabled={reservation.status === "DENIED"}
									loading={isStatusPending}
								>
									Deny
								</Button>
								<Button
									color="gray"
									size="xs"
									onClick={() => handleStatusChange("PENDING")}
									disabled={reservation.status === "PENDING"}
									loading={isStatusPending}
								>
									Pending
								</Button>
							</Group>
						)}

						<Group>
							{reservation && reservation.status !== "CANCELLED" && (
								<CancelReservationModal
									reservation={reservation}
									onCloseParent={close}
									loading={isStatusPending}
								/>
							)}
							<Button
								type="submit"
								loading={isSubmitPending}
								size="xs"
								disabled={reservation?.status === "CANCELLED"}
							>
								{reservation ? "Update" : "Create"}
							</Button>
						</Group>
					</Group>
				</form>
			</Modal>
		</>
	);
};

export default ReservationModal;
