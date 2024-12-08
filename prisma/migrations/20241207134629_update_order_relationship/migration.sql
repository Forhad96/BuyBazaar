/*
  Warnings:

  - You are about to drop the column `orderId` on the `orderItems` table. All the data in the column will be lost.
  - Added the required column `customerEmail` to the `orderItems` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "orderItems" DROP CONSTRAINT "orderItems_orderId_fkey";

-- AlterTable
ALTER TABLE "orderItems" DROP COLUMN "orderId",
ADD COLUMN     "customerEmail" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "orderItems" ADD CONSTRAINT "orderItems_customerEmail_fkey" FOREIGN KEY ("customerEmail") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
