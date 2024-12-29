import { Request, Response } from "express";
import { userServices } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import { userFilterableFields, userSearchAbleFields } from "./user.constant";
import sendResponse from "../../../shared/sendResponse";
import { IAuthUser } from "../../interfaces/common";
const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const filterData = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  // console.log(filterData);
  const result = await userServices.getAllUser(filterData, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully",
    meta: result.meta,
    // data: result
    data: result.data,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userServices.getUserById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

const getMyProfile = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await userServices.getMyProfile(user as IAuthUser);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User profile retrieved successfully",
      data: result,
    });
  }
);

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createAdmin(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});
const createCustomer = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createCustomer(
    req?.file?.path as string,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Customer created successfully",
    data: result,
  });
});
const createUser = catchAsync(async (req: Request, res: Response) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const profilePicturePath = files.profilePicture
    ? files.profilePicture[0].path
    : null;
  const shopLogoPath = files.shopLogo ? files.shopLogo[0].path : null;
  // console.log({ profilePicturePath, shopLogoPath });
  // console.log(req.body);
  const result = await userServices.createUser( profilePicturePath,shopLogoPath,req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User created successfully",
    data: result,
  });
});
const createVendor = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createVendor(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Vendor created successfully",
    data: result,
  });
});

const changeProfileStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await userServices.changeProfileStatus(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile status update successfully",
    data: result,
  });
});

const updateMyProfile = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const filePath = req?.file?.path as string;
    const result = await userServices.updateMyProfile(
      user as IAuthUser,
      filePath,
      req.body
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My profile updated!",
      data: result,
    });
  }
);



export const userController = {
  getAllUser,
  getUserById,
  getMyProfile,
  createAdmin,
  createUser,
  createCustomer,
  createVendor,
  changeProfileStatus,
  updateMyProfile,
};
