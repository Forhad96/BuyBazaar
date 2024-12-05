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

const getAllUser = async (params: any, options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  // console.log({searchTerm},{filterData});
  const andConditions: Prisma.UserWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: userSearchAbleFields.map((field) => ({
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
    orderBy: {
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

const createCustomer = async (filePath: string, payload: User) => {
  let uploadedFile = null;
  if (filePath) {
    uploadedFile = await fileUploader.uploadToCloudinary(filePath);
    payload.profilePicture = uploadedFile?.secure_url || null;
  }
  // (payload.password as string) && (await bcrypt.hash(payload.password, 12));
  payload.password =
    (payload.password as string) && (await bcrypt.hash(payload.password, 12));

  const result = await prisma.user.create({
    data: payload,
  });

  if (!result && uploadedFile) {
    fileUploader.destroyOnCloudinary(uploadedFile.public_id);
    throw new ApiError(
      httpStatus.EXPECTATION_FAILED,
      "Failed to create customer"
    );
  }
  return result;
};

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
  });

  return result;
};

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
  createCustomer,
  createVendor,
  createAdmin,
  getAllUser,
  getMyProfile,
  changeProfileStatus,
  updateMyProfile,
};

// {
//   type TPayload = {
//     user: Prisma.UserCreateInput;
//     vendor?: Prisma.VendorCreateInput;
//     customer?: Prisma.CustomerCreateInput;
//   };

//   const registerUser = async (filePath: string, payload: TPayload) => {
//     let profilePhotoUrl: string | null = null;
//   console.log(payload);
//     // Handle file upload if a file is provided
//     if (filePath) {
//       const uploadedFile = await fileUploader.uploadToCloudinary(filePath);
//       profilePhotoUrl = uploadedFile?.secure_url || null;
//       console.log(uploadedFile);
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(payload?.user?.password, 12);

//     let result = prisma.$transaction(async (transactionClient) => {
//       // Save the user to the database
//       if (payload && payload.user.role === UserRole.CUSTOMER) {
//         const customer = await transactionClient.user.create({
//           data: {
//             name: payload.user.name,
//             password: hashedPassword,
//             profilePicture: profilePhotoUrl,
//             email: payload.user.email,
//             role: payload.user.role,
//             customer: {
//               create: {...payload.customer},
//             },
//           },
//         });
//         return customer;
//       } else if (payload && payload.user.role === UserRole.VENDOR) {
//         const vendor = await prisma.user.create({
//           data: {
//             password: hashedPassword,
//             profilePicture: profilePhotoUrl,
//             name: payload.user.name,
//             email: payload.user.email,
//             role: payload.user.role,
//             customer: {
//               create: {...payload.vendor},
//             },
//           },
//         });
//         return vendor;
//       }
//     });

//     return result;
//   };

// }
