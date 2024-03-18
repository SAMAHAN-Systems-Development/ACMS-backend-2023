/*
  Warnings:

  - You are about to drop the column `eventTierId` on the `Student` table. All the data in the column will be lost.
  - Added the required column `eventTierOnEventId` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_eventTierId_fkey";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "eventTierId",
ADD COLUMN     "eventTierOnEventId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_eventTierOnEventId_fkey" FOREIGN KEY ("eventTierOnEventId") REFERENCES "EventTierOnEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
