"use client";

import { Title } from "@mantine/core";
import BookingsTable from "./BookingsTable";
import CreateBookingModal from "./CreateBookingModal";

const BookPage = () => {
	return (
		<>
			<Title mb="md">Your Reservations</Title>
			<CreateBookingModal />
			<BookingsTable />
		</>
	);
};

export default BookPage;
