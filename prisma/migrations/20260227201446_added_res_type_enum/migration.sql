/*
  Warnings:

  - You are about to drop the column `bookingType` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `contactPhoneNumber` on the `Reservation` table. All the data in the column will be lost.
  - Added the required column `contactPhone` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReservationType" AS ENUM ('STUDY', 'MEETING', 'EVENT', 'CLASS');

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "bookingType",
DROP COLUMN "contactPhoneNumber",
ADD COLUMN     "contactPhone" TEXT NOT NULL,
ADD COLUMN     "type" "ReservationType" NOT NULL;
