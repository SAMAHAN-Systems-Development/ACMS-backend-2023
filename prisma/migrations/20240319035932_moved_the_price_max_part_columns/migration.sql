/*
  Warnings:

  - You are about to drop the column `max_participants` on the `EventTier` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `EventTier` table. All the data in the column will be lost.
  - Added the required column `max_participants` to the `EventTierOnEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `EventTierOnEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventTier" DROP COLUMN "max_participants",
DROP COLUMN "price";

-- AlterTable
ALTER TABLE "EventTierOnEvent" ADD COLUMN     "max_participants" INTEGER NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;
