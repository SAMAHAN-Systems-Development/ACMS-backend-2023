/*
  Warnings:

  - You are about to drop the column `eventId` on the `Student` table. All the data in the column will be lost.
  - Added the required column `eventTierId` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_eventId_fkey";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "eventId",
ADD COLUMN     "eventTierId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_eventTierId_fkey" FOREIGN KEY ("eventTierId") REFERENCES "EventTier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
