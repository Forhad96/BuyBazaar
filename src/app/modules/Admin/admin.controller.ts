import { NextFunction, Request, RequestHandler, Response } from "express";
import { AdminServices } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterAbleFields } from "./admin.constant";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";

const getAllUsers = catchAsync(async (req, res) => {

  const filterData = pick(req.query, adminFilterAbleFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await AdminServices.getAllUsers(filterData, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const filePath = req?.file?.path as string;
  const result = await AdminServices.updateUser(id, filePath, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User update successfully",
    data: result,
  });
});



export const AdminController = {
  getAllUsers,
  updateUser,
};
