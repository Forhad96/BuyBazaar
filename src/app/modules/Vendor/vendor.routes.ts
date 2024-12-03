import { NextFunction, Request, Response, Router } from "express";
import { VendorController } from "./vendor.controller";
import { VendorValidationSchemas } from "./vendor.validation";
import { fileUploader } from "../../../helpers/fileUploader";

const router = Router();


router.get("/", VendorController.getAllVendors);
router.post(
  "/create-vendor",
  fileUploader.upload.single("file"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = VendorValidationSchemas.createVendorSchema.parse(
        JSON.parse(req.body.data)
      );
      req.body = parsedData;
      await VendorController.createVendor(req, res, next);
    } catch (error) {
      next(error); // Passes validation errors to the error handler middleware
    }
  }
);

export const VendorRoutes = router;
