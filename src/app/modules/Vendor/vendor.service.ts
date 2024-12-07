import { Prisma, UserRole, UserStatus } from "@prisma/client";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { vendorSearchAbleFields } from "./vendor.constant";

const getAllVendors = async (params: any, options: IPaginationOptions) => {
  console.log(options);
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.VendorWhereInput[] = [];

  //console.log(filterData);
  if (params.searchTerm) {
    andConditions.push({
      OR: vendorSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
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

  // andConditions.push({
  //   isDeleted: false,
  // });

  //console.dir(andConditions, { depth: 'infinity' })
  const whereConditions: Prisma.VendorWhereInput = { AND: andConditions };

  const result = await prisma.vendor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },

  include: {
    user: true
  }
  });

  const total = await prisma.vendor.count({
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
const createVendor = async (req: any) => {
  const { file, body } = req;
  let shopLogoUrl: string | null = null;

  // Get user information
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      id: body.ownerId,
      status: UserStatus.ACTIVE,
    },
  });

  // Handle file upload if a file is provided
  if (file) {
    const uploadedFile = await fileUploader.uploadToCloudinary(file);
    shopLogoUrl = uploadedFile?.secure_url || null;
  }

  // Construct vendor data
  const vendorData = {
    ...body,
    shopLogo: shopLogoUrl,
  };

  const result = prisma.$transaction(async (transactionClient) => {
    const vendor = await transactionClient.vendor.create({
      data: vendorData,
    });

    await transactionClient.user.update({
      where: { id: userInfo.id },
      data: { role: UserRole.VENDOR },
    });

    return vendor;
  });

  return result;
};

//Get Vendor products
const getVendorProducts = async (vendorId: string) => {
  const result = await prisma.product.findMany({
    where: {
      vendor: {
        id: vendorId,
      },
    },
  });
  return result;
}

export const vendorService = {
  createVendor,

  getAllVendors,
};
