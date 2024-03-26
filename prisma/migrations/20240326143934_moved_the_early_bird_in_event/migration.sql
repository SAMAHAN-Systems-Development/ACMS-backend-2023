/*
  Warnings:

  - You are about to drop the column `earlyBirdAccessDate` on the `EventTierOnEvent` table. All the data in the column will be lost.
  - You are about to drop the column `hasEarlyBirdAccess` on the `EventTierOnEvent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "earlyBirdAccessDate" TIMESTAMP(3),
ADD COLUMN     "hasEarlyBirdAccess" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "EventTierOnEvent" DROP COLUMN "earlyBirdAccessDate",
DROP COLUMN "hasEarlyBirdAccess";
