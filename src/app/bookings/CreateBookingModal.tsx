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

const CreateBookingModal = () => {
	const [opened, { open, close }] = useDisclosure(false);

	return (
		<>
			<Button onClick={open} mb="xs">
				Create Booking
			</Button>

			<Modal opened={opened} onClose={close} title="Book a Room">
				<Stack gap={"xs"}>
					<Autocomplete
						label="Room"
						placeholder="Select a room"
						data={["Morris Chapel", "Sears Hall - Room 112", "Sears Hall - Student Lobby"]}
					/>

					<Group grow>
						<DateTimePicker label="Start Time" />
						<DateTimePicker label="End Time" />
					</Group>

					<Select
						label="Booking Type"
						placeholder="Select a type"
						data={[
							{ value: "study", label: "Study" },
							{ value: "meeting", label: "Meeting" },
							{ value: "event", label: "Event" },
							{ value: "class", label: "Class" },
						]}
					/>

					<NumberInput label="Anticipated Attendance" min={1} />

					<Textarea label="Purpose" />

					<Textarea label="Supplies Needed" />

					<Divider mt="xs" />

					<TextInput label="Contact Name" />
					<TextInput label="Contact Email" />
					<TextInput label="Contact Number" />
				</Stack>

				<Group justify="flex-end" mt="lg">
					<Button>Submit</Button>
				</Group>
			</Modal>
		</>
	);
};

export default CreateBookingModal;
