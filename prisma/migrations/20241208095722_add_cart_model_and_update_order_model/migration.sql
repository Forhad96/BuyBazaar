/*
  Warnings:

  - The primary key for the `orderItems` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `customerEmail` on the `orderItems` table. All the data in the column will be lost.
  - The required column `id` was added to the `orderItems` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `orderId` to the `orderItems` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "orderItems" DROP CONSTRAINT "orderItems_customerEmail_fkey";

-- AlterTable
ALTER TABLE "orderItems" DROP CONSTRAINT "orderItems_pkey",
DROP COLUMN "customerEmail",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "orderId" TEXT NOT NULL,
ADD CONSTRAINT "orderItems_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_customerEmail_fkey" FOREIGN KEY ("customerEmail") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderItems" ADD CONSTRAINT "orderItems_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
