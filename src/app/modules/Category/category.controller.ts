import catchAsync from "../../../shared/catchAsync";
import { CategoryServices } from "./category.service";
import httpStatus from "http-status";
const createCategory = catchAsync(async (req, res) => {
  
  const result = await CategoryServices.createCategory(req.body);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Category created successfully",
    data: result,
  });
});

export const CategoryController = {
  createCategory,
};