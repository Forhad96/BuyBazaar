import { send } from "process";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { CategoryServices } from "./category.service";
import httpStatus from "http-status";
import { CLIENT_RENEG_LIMIT } from "tls";
const createCategory = catchAsync(async (req, res) => {
  const result = await CategoryServices.createCategory(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category created successfully",
    data: result,
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await CategoryServices.updateCategory(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category updated successfully",
    data: result,
  });
});

const deleteCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CategoryServices.deleteCategory(id); 
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category deleted successfully",
    data: result, 
  })
})
export const CategoryController = {
  createCategory,
  updateCategory,
  deleteCategory
};
