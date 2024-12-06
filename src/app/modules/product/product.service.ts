import { Product } from "@prisma/client";
import prisma from "../../../shared/prisma";

const getAllProducts = async (): Promise<Product[]> => {
  const result = await prisma.product.findMany();
  return result;
};

const createProduct = async (productData: any) => {
  const {
    name,
    description,
    price,
    categoryId,
    type,
    inventory,
    images,
    discount,
    vendorId,
    clothingDetails,
    electronicsDetails,
  } = productData;
  // console.log({electronicsDetails});
  // return
  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      categoryId,
      type,
      inventory,
      images,
      discount,
      vendorId,
      // Polymorphic relations
      clothingDetails: clothingDetails
        ? { create: clothingDetails }
        : undefined,
      electronicsDetails: electronicsDetails
        ? { create: electronicsDetails }
        : undefined,
    },
    include: {
      clothingDetails: true,
      electronicsDetails: true,
    },
  });
  return product;
};

export const ProductServices = {
  createProduct,
  getAllProducts,
};
