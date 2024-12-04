import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../../helpers/fileUploader";
import { z } from "zod";
import { UserValidationSchemas } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";
const router = Router();

const parseFormData = (
  req: Request,
  res: Response,
  next: NextFunction,
  schema: z.ZodType
) => {
  req.body = schema.parse(JSON.parse(req.body.data));
  next();
};

// router.get("/", auth(UserRole.SuperAdmin,UserRole.Admin) ,userController.getAllFromDB);
// router.get("/me", auth(UserRole.SuperAdmin,UserRole.Admin,UserRole.Vendor,UserRole.Customer) ,userController.getMyProfile);

router.post(
  "/create-admin",
  auth(UserRole.SUPERADMIN),
  validateRequest(UserValidationSchemas.createAdminSchema),
  userController.createAdmin
);

router.post(
  "/create-customer",
  fileUploader.upload.single("file"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = UserValidationSchemas.createCustomerSchema.parse(
        JSON.parse(req.body.data)
      );
      req.body = parsedData;
      await userController.createCustomer(req, res, next);
    } catch (error) {
      next(error); // Passes validation errors to the error handler middleware
    }
  }
);

router.post("/create-vendor",validateRequest(UserValidationSchemas.createVendorSchema),userController.createVendor);

export const UserRoutes = router;
