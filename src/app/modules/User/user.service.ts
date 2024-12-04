import {
  Customer,
  Prisma,
  PrismaClient,
  User,
  UserRole,
  UserStatus,
  Vendor,
} from "@prisma/client";
import * as bcrypt from "bcrypt";
import { fileUploader } from "../../../helpers/fileUploader";
import { IFile } from "../../interfaces/file";
import { Request } from "express";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { userSearchAbleFields } from "./user.constant";
import { IAuthUser } from "../../interfaces/common";
import { generateHashedPassword } from "../../../helpers/bcryptHelper";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
const createCustomer = async (filePath: string, payload: User) => {
  if (filePath) {
    const uploadedFile = await fileUploader.uploadToCloudinary(filePath);
    payload.profilePicture = uploadedFile?.secure_url || null;
    payload.password =
      (payload.password as string) && (await bcrypt.hash(payload.password, 12));

    const result = await prisma.user.create({
      data: {
        ...payload,
        customer: {
          create: {},
        },
      },
    });

    if (!result) {
      fileUploader.destroyOnCloudinary(uploadedFile.public_id);
      throw new ApiError(
        httpStatus.EXPECTATION_FAILED,
        "Failed to create customer"
      );
    }
    return result;
  }
};

// const getAllFromDB = async (params: any, options: IPaginationOptions) => {
//   const { page, limit, skip } = paginationHelper.calculatePagination(options);
//   const { searchTerm, ...filterData } = params;

//   const andConditions: Prisma.UserWhereInput[] = [];

//   //console.log(filterData);
//   if (params.searchTerm) {
//     andConditions.push({
//       OR: userSearchAbleFields.map((field) => ({
//         [field]: {
//           contains: params.searchTerm,
//           mode: "insensitive",
//         },
//       })),
//     });
//   }

//   if (Object.keys(filterData).length > 0) {
//     andConditions.push({
//       AND: Object.keys(filterData).map((key) => ({
//         [key]: {
//           equals: (filterData as any)[key],
//         },
//       })),
//     });
//   }

//   const whereConditions: Prisma.UserWhereInput =
//     andConditions.length > 0 ? { AND: andConditions } : {};

//   const result = await prisma.user.findMany({
//     where: whereConditions,
//     skip,
//     take: limit,
//     orderBy:
//       options.sortBy && options.sortOrder
//         ? {
//             [options.sortBy]: options.sortOrder,
//           }
//         : {
//             createdAt: "desc",
//           },
//     select: {
//       id: true,
//       email: true,
//       role: true,
//       needPasswordChange: true,
//       status: true,
//       createdAt: true,
//       updatedAt: true,
//       Admin: true,
//     },
//   });

//   const total = await prisma.user.count({
//     where: whereConditions,
//   });

//   return {
//     meta: {
//       page,
//       limit,
//       total,
//     },
//     data: result,
//   };
// };
// const changeProfileStatus = async (id: string, status: UserStatus) => {
//   const userData = await prisma.user.findUniqueOrThrow({
//     where: {
//       id,
//     },
//   });

//   const updateUserStatus = await prisma.user.update({
//     where: {
//       id,
//     },
//     data: status,
//   });

//   return updateUserStatus;
// };

// const getMyProfile = async (user: IAuthUser) => {
//   const userInfo = await prisma.user.findUniqueOrThrow({
//     where: {
//       email: user?.email,
//       status: UserStatus.Active,
//     },
//     select: {
//       id: true,
//       email: true,
//       needPasswordChange: true,
//       role: true,
//       status: true,
//     },
//   });
//   let profileInfo;

//   if (userInfo.role === UserRole.SuperAdmin) {
//     profileInfo = await prisma.admin.findUnique({
//       where: {
//         email: userInfo.email,
//       },
//     });
//   } else if (userInfo.role === UserRole.Admin) {
//     profileInfo = await prisma.admin.findUnique({
//       where: {
//         email: userInfo.email,
//       },
//     });
//   }
//   return { ...userInfo, ...profileInfo };
// };
// const updateMyProfile = async (user: IAuthUser, req: Request) => {
//   const userInfo = await prisma.user.findUniqueOrThrow({
//       where: {
//           email: user?.email,
//           status: UserStatus.Active
//       }
//   });

//   const file = req.file as IFile;
//   if (file) {
//       const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
//       req.body.profilePhoto = uploadToCloudinary?.secure_url;
//   }

//   let profileInfo;

//   if (userInfo.role === UserRole.SUPER_ADMIN) {
//       profileInfo = await prisma.admin.update({
//           where: {
//               email: userInfo.email
//           },
//           data: req.body
//       })
//   }
//   else if (userInfo.role === UserRole.ADMIN) {
//       profileInfo = await prisma.admin.update({
//           where: {
//               email: userInfo.email
//           },
//           data: req.body
//       })
//   }
//   else if (userInfo.role === UserRole.DOCTOR) {
//       profileInfo = await prisma.doctor.update({
//           where: {
//               email: userInfo.email
//           },
//           data: req.body
//       })
//   }
//   else if (userInfo.role === UserRole.PATIENT) {
//       profileInfo = await prisma.patient.update({
//           where: {
//               email: userInfo.email
//           },
//           data: req.body
//       })
//   }

//   return { ...profileInfo };
// }

export const userServices = {
  createCustomer,

  // getAllFromDB,
  // changeProfileStatus,
  // getMyProfile,
  // updateMyProfile
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
