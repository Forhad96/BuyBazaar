import { Prisma, PrismaClient, UserRole, UserStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { fileUploader } from "../../../helpers/fileUploader";
import { IFile } from "../../interfaces/file";
import { Request } from "express";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { userSearchAbleFields } from "./user.constant";
import { IAuthUser } from "../../interfaces/common";

const prisma = new PrismaClient();

const createUser = async (req: Request) => {
  const { file, body } = req;
  let profilePhotoUrl: string | null = null;

  // Handle file upload if a file is provided
  if (file) {
    const uploadedFile = await fileUploader.uploadToCloudinary(file);
    profilePhotoUrl = uploadedFile?.secure_url || null;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(body.password, 12);

  // Construct user data
  const userData = {
    ...body,
    password: hashedPassword,
    profilePhoto: profilePhotoUrl,
  };

  // Save the user to the database
  const result = await prisma.user.create({ data: userData });
  return result;
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
  createUser,

  // getAllFromDB,
  // changeProfileStatus,
  // getMyProfile,
  // updateMyProfile
};
