import { Product } from "@prisma/client";
import prisma from "../../../shared/prisma";

const getAllProducts = async (): Promise<Product[]> => {
  const result = await prisma.product.findMany();
  return result;
};

const createProduct = async (productData: any) => {
  const product = await prisma.product.upsert({
    where: {
      vendorId_categoryId_name: {
        name: productData.name,
        vendorId: productData.vendorId,
        categoryId: productData.categoryId,
      },
    },
    update: {
      inventoryCount: {
        increment: productData.inventoryCount,
      },
    },
    create: productData,
  });
  return product;
};
export const ProductServices = {
  createProduct,
  getAllProducts,
};
