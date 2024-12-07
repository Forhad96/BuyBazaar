import { Prisma, Product } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { productSearchAbleFields } from "./product.constant";
import { ProductResponse } from "./product.interface";
import { fileUploader } from "../../../helpers/fileUploader";

const getAllProducts = async (params: any, options: any): Promise<ProductResponse> => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions:Prisma.ProductWhereInput[] = [];
  if (params.searchTerm) {
    andConditions.push({
      OR: productSearchAbleFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.ProductWhereInput = {
    AND: andConditions,
    
  };

  const result = await prisma.product.findMany({
    where: whereConditions,
    skip,
    take: limit,
    include: {
      vendor: true,
      clothingDetails: true,
      electronicsDetails: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.product.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const createProduct = async (filePaths: string[], productData: any) => {
  const {
    name,
    description,
    price,
    categoryId,
    type,
    inventory,
    discount,
    vendorId,
    clothingDetails,
    electronicsDetails,
  } = productData;
  let images:string[] = [];
if(filePaths.length > 0){
  const uploadedFiles = await fileUploader.uploadMultipleFilesToCloudinary(filePaths);
   images = uploadedFiles.map((file) => file.secure_url);
  productData.images = images;
}

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

const updateProduct = async (id: string, imagePaths: string[], productData: any) => {
  const { name, description, price, categoryId, type, inventory, discount, clothingDetails, electronicsDetails } = productData;
  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      price,
      categoryId,
      type,
      inventory,
      discount,
      images: imagePaths.length > 0 ? (await Promise.all(imagePaths.map((filePath) => fileUploader.uploadToCloudinary(filePath)))).map((file) => file.secure_url) : undefined,
      electronicsDetails: electronicsDetails ? { update: electronicsDetails } : undefined,
      clothingDetails: clothingDetails ? { update: clothingDetails } : undefined,
    },
    include: {
      electronicsDetails: true,    
      clothingDetails: true,
    },
  });
  return product;
}

export const ProductServices = {
  createProduct,
  getAllProducts,
  updateProduct,
};
