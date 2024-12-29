import { Prisma, UserStatus } from "@prisma/client";
import { adminSearchAbleFields } from "./admin.constant";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { IAdminFilterRequest } from "./admin.interface";
import { IPaginationOptions } from "../../interfaces/pagination";
import { fileUploader } from "../../../helpers/fileUploader";
import { IUserFilterRequest } from "../User/user.interface";
import { userSearchAbleFields } from "../User/user.constant";

const getAllUsers = async (
  params: IUserFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  // console.log({searchTerm},{filterData});

  const andConditions: Prisma.UserWhereInput[] = [];
  if (params.searchTerm) {
    andConditions.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  // console.dir(andConditions, { depth: null });

  // return
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    include: {
      vendor: true,
    },
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.user.count({
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
const updateUser = async (id: string, filePath: string, payload: any) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (filePath) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(filePath);
    payload.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const profileInfo = await prisma.user.update({
    where: {
      id: userInfo.id,
    },
    data: payload,
  });

  return profileInfo;
};

export const AdminServices = {
  getAllUsers,
  updateUser,
};
