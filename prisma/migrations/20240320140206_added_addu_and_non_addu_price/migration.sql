/*
  Warnings:

  - You are about to drop the column `price` on the `EventTierOnEvent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EventTierOnEvent" DROP COLUMN "price",
ADD COLUMN     "adduPrice" DOUBLE PRECISION,
ADD COLUMN     "nonAdduPrice" DOUBLE PRECISION;
