/*
  Warnings:

  - You are about to drop the column `requiredPayment` on the `Payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "requiredPayment",
ADD COLUMN     "required_payment" DOUBLE PRECISION;
