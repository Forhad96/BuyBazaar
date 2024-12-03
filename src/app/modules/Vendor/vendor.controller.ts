import catchAsync from "../../../shared/catchAsync";
import { vendorService } from "./vendor.service";
import httpStatus from "http-status";
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
};
