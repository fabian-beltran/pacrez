"use client";
import React from "react";
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
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { DateTimePicker } from "@mantine/dates";
import { Building, Room, ReservationType } from "@/generated/prisma/browser";
import { zod4Resolver } from "mantine-form-zod-resolver";
import * as z from "zod";
import { useForm } from "@mantine/form";

const createReservationSchema = z.object({
	building: z.string(),
	room: z.string(),
	startTime: z.coerce.date(),
	endTime: z.coerce.date(),
	reservationType: z.string(),
	anticipatedAttendance: z.int().min(1),
	purpose: z.string(),
	suppliesNeeded: z.string(),
	contactName: z.string(),
	contactEmail: z.email(),
	contactPhone: z.string(),
});

const reservationTypeOptions = Object.values(ReservationType).map((type) => ({
	value: type,
	label: type.charAt(0) + type.slice(1).toLowerCase(),
}));

const CreateReservationModal = ({ buildings }: { buildings: (Building & { rooms: Room[] })[] }) => {
	const [opened, { open, close }] = useDisclosure(false);

	const form = useForm({
		initialValues: {
			building: "",
			room: "",
			startTime: new Date(),
			endTime: new Date(),
			reservationType: "",
			anticipatedAttendance: 1,
			purpose: "",
			suppliesNeeded: "",
			contactName: "",
			contactEmail: "",
			contactPhone: "",
		},
		validate: zod4Resolver(createReservationSchema),
	});

	const handleSubmit = (values: typeof form.values) => {
		console.log("Login values:", values);
	};

	return (
		<>
			<Button onClick={open} mb="xs">
				Create Reservation
			</Button>

			<Modal opened={opened} onClose={close} title="Create Reservation">
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<Stack gap={"xs"}>
						<Autocomplete
							label="Building"
							placeholder="Select a building"
							data={buildings.map((b) => b.name)}
							{...form.getInputProps("building")}
						/>
						<Autocomplete label="Room" placeholder="Select a room" {...form.getInputProps("room")} />

						<Group grow>
							<DateTimePicker label="Start Time" {...form.getInputProps("startTime")} />
							<DateTimePicker label="End Time" {...form.getInputProps("endTime")} />
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
						<TextInput label="Contact Number" {...form.getInputProps("contactNumber")} />
					</Stack>

					<Group justify="flex-end" mt="lg">
						<Button type="submit">Submit</Button>
					</Group>
				</form>
			</Modal>
		</>
	);
};

export default CreateReservationModal;
