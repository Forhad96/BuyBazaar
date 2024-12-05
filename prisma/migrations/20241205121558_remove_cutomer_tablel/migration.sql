/*
  Warnings:

  - You are about to drop the column `customerId` on the `follows` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `recentViews` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `vendors` table. All the data in the column will be lost.
  - You are about to drop the `customers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `follows` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `recentViews` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "customers" DROP CONSTRAINT "customers_userId_fkey";

-- DropForeignKey
ALTER TABLE "follows" DROP CONSTRAINT "follows_customerId_fkey";

-- DropForeignKey
ALTER TABLE "recentViews" DROP CONSTRAINT "recentViews_customerId_fkey";

-- AlterTable
ALTER TABLE "follows" DROP COLUMN "customerId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "recentViews" DROP COLUMN "customerId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "zipCode" TEXT;

-- AlterTable
ALTER TABLE "vendors" DROP COLUMN "isDeleted";

-- DropTable
DROP TABLE "customers";

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recentViews" ADD CONSTRAINT "recentViews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
