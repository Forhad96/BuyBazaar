import { NextFunction, Request, RequestHandler, Response } from "express";
import { AdminServices } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterAbleFields } from "./admin.constant";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";

const getAllUsers = catchAsync(async (req, res) => {
  const filterData = pick(req.query, adminFilterAbleFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await AdminServices.getAllFromDB(filterData, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin data retrieves successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminServices.getByIdFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin by id retrieves successfully",
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminServices.updateIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin data update successfully",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminServices.deleteFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin data deleted successfully",
    data: result,
  });
});
const softDeleteFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminServices.softDeleteFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin data deleted successfully",
    data: result,
  });
});

export const AdminController = {
  getAllUsers,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDeleteFromDB,
};


