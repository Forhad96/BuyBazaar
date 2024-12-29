import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller";
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
  UserController.getAllUser
);

//get user by id
router.get(
  "/:id",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  UserController.getUserById
);

// ge my profile
router.get(
  "/me",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.VENDOR, UserRole.CUSTOMER),
  UserController.getMyProfile
);

// create admin
router.post(
  "/create-admin",
  auth(UserRole.SUPERADMIN),
  validateRequest(UserValidationSchemas.createAdminSchema),
  UserController.createAdmin
);
import multer from 'multer';
const upload = multer();
//create  user
router.post(
  "/create-user",
  upload.fields([{ name:"profilePicture",},{ name:"shopLogo"}]),
  parseFormData(UserValidationSchemas.createUserSchema),
  UserController.createUser
  
)

//create customer
router.post(
  "/create-customer",
  fileUploader.upload.single("file"), parseFormData(UserValidationSchemas.createUserSchema),UserController.createCustomer
);

//create vendor
router.post(
  "/create-vendor",
  validateRequest(UserValidationSchemas.createVendorSchema),
  UserController.createVendor
);

//Change profile Status
router.patch(
  "/change-profile-status/:id",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  UserController.changeProfileStatus
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
      await UserController.updateMyProfile(req, res, next);
    } catch (error) {
      next(error); // Passes validation errors to the error handler middleware
    }
  }
);

export const UserRoutes = router;
