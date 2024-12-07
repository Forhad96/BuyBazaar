-- DropForeignKey
ALTER TABLE "clothingProduct" DROP CONSTRAINT "clothingProduct_productId_fkey";

-- DropForeignKey
ALTER TABLE "electronicsProduct" DROP CONSTRAINT "electronicsProduct_productId_fkey";

-- AddForeignKey
ALTER TABLE "clothingProduct" ADD CONSTRAINT "clothingProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "electronicsProduct" ADD CONSTRAINT "electronicsProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
