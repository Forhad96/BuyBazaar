/*
  Warnings:

  - The primary key for the `products` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "products" DROP CONSTRAINT "products_pkey",
ADD CONSTRAINT "products_pkey" PRIMARY KEY ("vendorId", "categoryId", "name");
