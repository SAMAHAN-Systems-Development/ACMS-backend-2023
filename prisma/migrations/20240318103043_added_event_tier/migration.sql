/*
  Warnings:

  - You are about to drop the column `max_participants` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Event` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_eventId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "max_participants",
DROP COLUMN "price";

-- CreateTable
CREATE TABLE "EventTier" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "max_participants" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "EventTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventTierOnEvent" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "eventId" INTEGER NOT NULL,
    "eventTierId" INTEGER NOT NULL,

    CONSTRAINT "EventTierOnEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "EventTier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTierOnEvent" ADD CONSTRAINT "EventTierOnEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTierOnEvent" ADD CONSTRAINT "EventTierOnEvent_eventTierId_fkey" FOREIGN KEY ("eventTierId") REFERENCES "EventTier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
