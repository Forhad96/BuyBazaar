/*
  Warnings:

  - You are about to drop the `admins` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "admins" DROP CONSTRAINT "admins_email_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "profilePhoto" TEXT,
ALTER COLUMN "username" DROP NOT NULL,
ALTER COLUMN "lastLogin" DROP NOT NULL;

-- DropTable
DROP TABLE "admins";

-- DropEnum
DROP TYPE "Gender";
