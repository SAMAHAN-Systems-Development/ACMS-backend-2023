/*
  Warnings:

  - You are about to drop the column `adduPrice` on the `EventTierOnEvent` table. All the data in the column will be lost.
  - You are about to drop the column `nonAdduPrice` on the `EventTierOnEvent` table. All the data in the column will be lost.
  - Added the required column `earlyBirdAccessDate` to the `EventTierOnEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventTierOnEvent" DROP COLUMN "adduPrice",
DROP COLUMN "nonAdduPrice",
ADD COLUMN     "earlyBirdAccessDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "earlyBirdPrice" DOUBLE PRECISION,
ADD COLUMN     "hasEarlyBirdAccess" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "originalPrice" DOUBLE PRECISION;
