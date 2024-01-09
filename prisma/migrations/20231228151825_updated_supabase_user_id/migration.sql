/*
  Warnings:

  - A unique constraint covering the columns `[supabaseUserId]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Users_supabaseUserId_key" ON "Users"("supabaseUserId");
