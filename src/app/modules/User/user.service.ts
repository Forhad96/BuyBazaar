import { Prisma, User, UserRole, UserStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { fileUploader } from "../../../helpers/fileUploader";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { userSearchAbleFields } from "./user.constant";
import { IAuthUser } from "../../interfaces/common";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { IUserFilterRequest } from "./user.interface";
import { object } from "zod";

//get all users
const getAllUser = async (
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

//get user by id
const getUserById = async (userId: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      vendor: true,
    },
  });

  return result;
};

//get my profile
const getMyProfile = async (user: IAuthUser) => {
  if (user === null) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "User is null");
  }
  const result = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
    include: {
      vendor: true,
    },
  });
  return result;
};

//create customer
const createCustomer = async (filePath: string, payload: User) => {
  let uploadedFile = null;
  if (filePath) {
    uploadedFile = await fileUploader.uploadToCloudinary(filePath);
    payload.profilePicture = uploadedFile?.secure_url || null;
  }
  payload.password =
    (payload.password as string) && (await bcrypt.hash(payload.password, 12));

  const result = await prisma.user.create({
    data: payload,
  });

  // if (!result && uploadedFile) {
  //   fileUploader.destroyOnCloudinary(uploadedFile.public_id);
  //   throw new ApiError(
  //     httpStatus.EXPECTATION_FAILED,
  //     "Failed to create customer"
  //   );
  // }
  return result;
};

//create vendor
const createVendor = async (payload: any) => {
  if (payload.role !== UserRole.VENDOR) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Role must be VENDOR");
  }

  payload.password =
    (payload.password as string) && (await bcrypt.hash(payload.password, 12));

  const result = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      role: payload.role,
      password: payload.password,
      vendor: {
        create: {
          shopName: payload.shopName,
        },
      },
    },
    include: {
      vendor: true,
    },
  });

  return result;
};

//create user
const createUser = async (
  profilePicturePath: string | null,
  shopLogoPath: string | null,
  payload: any
) => {
  // Check if the role is valid
  if (![UserRole.CUSTOMER, UserRole.VENDOR].includes(payload.role)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid role");
  }

  // Handle file upload for profile picture if a file path is provided
  let uploadedFile = null;
  if (profilePicturePath) {
    uploadedFile = await fileUploader.uploadToCloudinary(profilePicturePath);
    payload.profilePicture = uploadedFile?.secure_url || null;
  }

  // Handle file upload for shop logo if a shop logo path is provided and the role is VENDOR
  let uploadedShopLogo = null;
  if (shopLogoPath && payload.role === UserRole.VENDOR) {
    uploadedShopLogo = await fileUploader.uploadToCloudinary(shopLogoPath);
  }

  // Hash the password
  payload.password =
    (payload.password as string) && (await bcrypt.hash(payload.password, 12));

  // Prepare the data object for Prisma
  const data: any = {
    name: payload.name,
    email: payload.email,
    role: payload.role,
    password: payload.password,
  };

  // Add vendor-specific data if the role is VENDOR
  if (payload.role === UserRole.VENDOR) {
    data.vendor = {
      create: {
        shopName: payload.shopName,
        shopLogo: uploadedShopLogo?.secure_url || null, // Add shop logo URL
      },
    };
  }

  // Create the user in the database
  const result = await prisma.user.create({
    data: data,
  });

  // Return the result
  return result;
};

//create admin
const createAdmin = async (payload: any) => {
  if (payload.role !== UserRole.ADMIN) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Role must be ADMIN");
  }

  payload.password =
    (payload.password as string) && (await bcrypt.hash(payload.password, 12));

  const result = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      role: payload.role,
      password: payload.password,
    },
  });

  return result;
};

//Change profile Status
const changeProfileStatus = async (userId: string, status: UserStatus) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  //update user status
  const updateUserStatus = await prisma.user.update({
    where: { id: userId },
    data: status,
  });

  return updateUserStatus;
};

//update my profile
const updateMyProfile = async (
  user: IAuthUser,
  filePath: string,
  payload: any
) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
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

export const userServices = {
  createUser,
  createCustomer,
  createVendor,
  createAdmin,
  getAllUser,
  getUserById,
  getMyProfile,
  changeProfileStatus,
  updateMyProfile,
};
