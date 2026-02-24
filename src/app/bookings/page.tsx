"use client";

import BookingsTable from "./BookingsTable";
import CreateBookingModal from "./CreateBookingModal";

const BookPage = () => {
	return (
		<>
			<CreateBookingModal />
			<BookingsTable />
		</>
	);
};

export default BookPage;
