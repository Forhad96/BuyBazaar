/*
  Warnings:

  - The `followersCount` column on the `vendors` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `isBlacklisted` column on the `vendors` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "vendors" DROP COLUMN "followersCount",
ADD COLUMN     "followersCount" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "isBlacklisted",
ADD COLUMN     "isBlacklisted" BOOLEAN NOT NULL DEFAULT false;
