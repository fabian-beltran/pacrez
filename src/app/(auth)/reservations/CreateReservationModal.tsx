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
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { DateTimePicker } from "@mantine/dates";
import { Building, Room, ReservationType } from "@/generated/prisma/browser";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useForm } from "@mantine/form";
import { CreateReservationInput, createReservationSchema } from "@/lib/schemas/reservations";
import { createReservation } from "@/server-actions/reservations";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

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

const CreateReservationModal = ({ buildings }: { buildings: (Building & { rooms: Room[] })[] }) => {
	const { start, end } = getDefaultTimes();
	const router = useRouter();
	const [opened, { open, close }] = useDisclosure(false, { onClose: () => form.reset() });
	const [loading, startTransition] = useTransition();
	const form = useForm<CreateReservationInput>({
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
		validate: zod4Resolver(createReservationSchema),
	});

	const handleSubmit = async (values: CreateReservationInput) => {
		startTransition(async () => {
			try {
				await createReservation(values);
				close();
				router.refresh();
			} catch (error) {
				console.error(error);
			}
		});
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
							{...form.getInputProps("buildingName")}
							onChange={(value) => {
								form.setFieldValue("buildingName", value);
								form.setFieldValue("roomName", "");
							}}
						/>

						<Autocomplete
							label="Room"
							placeholder="Select a room"
							data={
								buildings.find((b) => b.name === form.values.buildingName)?.rooms.map((r) => r.name) ??
								[]
							}
							disabled={!form.values.buildingName}
							{...form.getInputProps("roomName")}
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

					<Group justify="flex-end" mt="lg">
						<Button type="submit" loading={loading}>
							Submit
						</Button>
					</Group>
				</form>
			</Modal>
		</>
	);
};

export default CreateReservationModal;
