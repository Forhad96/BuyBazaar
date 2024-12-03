import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { vendorFilterAbleFields } from "./vendor.constant";
import { vendorService } from "./vendor.service";
import httpStatus from "http-status";

const getAllVendors = catchAsync(async (req, res) => {
  const filterData = pick(req.query, vendorFilterAbleFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await vendorService.getAllVendors(filterData, options);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Vendors retrieved successfully",
    data: result,
  });
})

const createVendor = catchAsync(async (req, res) => {
  const result = await vendorService.createVendor(req);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Vendor created successfully",
    data: result,
  });
});

export const VendorController = {
  createVendor,
  getAllVendors,
};
