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
import { Building, Reservation } from "@/lib/prisma-types";
import { ReservationComments } from "./ReservationComments";

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

const ReservationModal = ({ buildings, reservation }: { buildings: Building[]; reservation?: Reservation }) => {
	const user = useAuth();
	const { start, end } = getDefaultTimes();
	const router = useRouter();
	const [opened, { open, close }] = useDisclosure(false, { onClose: () => !reservation && form.reset() });
	const [isPending, startTransition] = useTransition();
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

	const handleSubmit = async (values: ReservationInput) => {
		startTransition(async () => {
			try {
				if (!reservation) {
					await createReservation(values);
				} else {
					await updateReservation(reservation.id, values);
				}
				close();
				router.refresh();
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
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reservation?.id]);

	const handleStatusChange = async (status: ReservationStatus) => {
		if (!reservation) return;
		try {
			await updateReservationStatus(reservation.id, status);
			router.refresh();
			close();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			{!reservation && (
				<Button onClick={open} mb="xs">
					Create Reservation
				</Button>
			)}
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
							readOnly={!!reservation}
							styles={reservation ? { input: { cursor: "not-allowed" } } : undefined}
						/>

						<Autocomplete
							label="Room"
							placeholder="Select a room"
							data={
								buildings.find((b) => b.name === form.values.buildingName)?.rooms.map((r) => r.name) ??
								[]
							}
							disabled={!reservation && !form.values.buildingName}
							{...form.getInputProps("roomName")}
							readOnly={!!reservation}
							styles={reservation ? { input: { cursor: "not-allowed" } } : undefined}
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
							/>
						</Group>

						<Select
							label="Reservation Type"
							placeholder="Select a type"
							data={reservationTypeOptions}
							{...form.getInputProps("reservationType")}
						/>

						<NumberInput
							label="Anticipated Attendance"
							min={1}
							{...form.getInputProps("anticipatedAttendance")}
						/>

						<Textarea label="Purpose" {...form.getInputProps("purpose")} />

						<Textarea label="Supplies Needed" {...form.getInputProps("suppliesNeeded")} />

						<Divider mt="xs" />

						<TextInput label="Contact Name" {...form.getInputProps("contactName")} />
						<TextInput label="Contact Email" {...form.getInputProps("contactEmail")} />
						<TextInput label="Contact Phone Number" {...form.getInputProps("contactPhone")} />
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
									onClick={() => handleStatusChange("APPROVED")}
									disabled={reservation.status === "APPROVED"}
								>
									Approve
								</Button>
								<Button
									color="red"
									onClick={() => handleStatusChange("DENIED")}
									disabled={reservation.status === "DENIED"}
								>
									Deny
								</Button>
								<Button
									color="gray"
									onClick={() => handleStatusChange("PENDING")}
									disabled={reservation.status === "PENDING"}
								>
									Pending
								</Button>
							</Group>
						)}

						<Group>
							<Button type="submit" loading={isPending}>
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
