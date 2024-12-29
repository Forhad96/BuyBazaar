import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../../helpers/fileUploader";
import { z } from "zod";
import { UserValidationSchemas } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";
import { parseFormData } from "../../../helpers/parseFormData";
const router = Router();


// get all user
router.get(
  "/",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  userController.getAllUser
);

//get user by id
router.get(
  "/:id",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  userController.getUserById
);

// ge my profile
router.get(
  "/me",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.VENDOR, UserRole.CUSTOMER),
  userController.getMyProfile
);

// create admin
router.post(
  "/create-admin",
  auth(UserRole.SUPERADMIN),
  validateRequest(UserValidationSchemas.createAdminSchema),
  userController.createAdmin
);
import multer from 'multer';
const upload = multer();
//create  user
router.post(
  "/create-user",
  upload.fields([{ name:"profilePicture",},{ name:"shopLogo"}]),
  parseFormData(UserValidationSchemas.createUserSchema),
  userController.createUser
  
)

//create customer
router.post(
  "/create-customer",
  fileUploader.upload.single("file"), parseFormData(UserValidationSchemas.createUserSchema),userController.createCustomer
);

//create vendor
router.post(
  "/create-vendor",
  validateRequest(UserValidationSchemas.createVendorSchema),
  userController.createVendor
);

//Change profile Status
router.patch(
  "/change-profile-status/:id",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  userController.changeProfileStatus
);

// update my profile
router.patch(
  "/update-my-profile",
  auth(UserRole.SUPERADMIN,UserRole.ADMIN,UserRole.CUSTOMER,UserRole.VENDOR),
  fileUploader.upload.single("file"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = UserValidationSchemas.updateUserSchema.parse(
        JSON.parse(req.body.data)
      );
      req.body = parsedData;
      await userController.updateMyProfile(req, res, next);
    } catch (error) {
      next(error); // Passes validation errors to the error handler middleware
    }
  }
);

export const UserRoutes = router;
