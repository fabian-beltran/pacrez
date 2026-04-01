/*
  Warnings:

  - Added the required column `mapLeft` to the `Building` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mapTop` to the `Building` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Building" ADD COLUMN     "mapLeft" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "mapTop" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "statusUpdatedAt" TIMESTAMP(3),
ADD COLUMN     "statusUpdatedById" TEXT;

-- CreateTable
CREATE TABLE "ReservationComment" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parentId" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReservationComment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_statusUpdatedById_fkey" FOREIGN KEY ("statusUpdatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservationComment" ADD CONSTRAINT "ReservationComment_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservationComment" ADD CONSTRAINT "ReservationComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservationComment" ADD CONSTRAINT "ReservationComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ReservationComment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
