/*
  Warnings:

  - The primary key for the `orderItems` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `orderItems` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orderItems" DROP CONSTRAINT "orderItems_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "orderItems_pkey" PRIMARY KEY ("customerEmail", "productId");

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "paymentMethod" DROP NOT NULL;
