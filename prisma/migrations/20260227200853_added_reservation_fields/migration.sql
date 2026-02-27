/*
  Warnings:

  - Added the required column `anticipatedAttendance` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bookingType` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactEmail` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactName` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactPhoneNumber` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purpose` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `suppliesNeeded` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "anticipatedAttendance" INTEGER NOT NULL,
ADD COLUMN     "bookingType" TEXT NOT NULL,
ADD COLUMN     "contactEmail" TEXT NOT NULL,
ADD COLUMN     "contactName" TEXT NOT NULL,
ADD COLUMN     "contactPhoneNumber" TEXT NOT NULL,
ADD COLUMN     "purpose" TEXT NOT NULL,
ADD COLUMN     "suppliesNeeded" TEXT NOT NULL;
