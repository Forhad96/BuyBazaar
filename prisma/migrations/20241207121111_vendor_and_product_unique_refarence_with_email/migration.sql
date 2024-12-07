/*
  Warnings:

  - You are about to drop the column `vendorId` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `vendors` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `vendors` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `vendorEmail` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `vendors` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "vendors" DROP CONSTRAINT "vendors_userId_fkey";

-- DropIndex
DROP INDEX "vendors_userId_key";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "vendorId",
ADD COLUMN     "vendorEmail" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "vendors" DROP COLUMN "userId",
ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "vendors_email_key" ON "vendors"("email");

-- AddForeignKey
ALTER TABLE "vendors" ADD CONSTRAINT "vendors_email_fkey" FOREIGN KEY ("email") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_vendorEmail_fkey" FOREIGN KEY ("vendorEmail") REFERENCES "vendors"("email") ON DELETE CASCADE ON UPDATE CASCADE;
