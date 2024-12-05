/*
  Warnings:

  - You are about to drop the column `needsPasswordChange` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "needsPasswordChange",
ADD COLUMN     "needPasswordChange" BOOLEAN NOT NULL DEFAULT true;
