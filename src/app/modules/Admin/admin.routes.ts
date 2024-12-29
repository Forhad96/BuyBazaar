import { NextFunction, Request, Response, Router } from "express";
import { AdminController } from "./admin.controller";
import validateRequest from "../../middlewares/validateRequest";
import { adminValidationSchemas } from "./admin.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { UserValidationSchemas } from "../User/user.validation";
import { fileUploader } from "../../../helpers/fileUploader";

const router = Router();

router.get("/get-all-users", auth(UserRole.SUPERADMIN),AdminController.getAllUsers);

router.patch(
  "/update-user/:id",auth(UserRole.ADMIN,UserRole.SUPERADMIN),
  fileUploader.upload.single("file"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = UserValidationSchemas.updateUserSchema.parse(
        JSON.parse(req.body.data)
      );
      req.body = parsedData;
      await AdminController.updateUser(req, res, next);
    } catch (error) {
      next(error); // Passes validation errors to the error handler middleware
    }
  }
);


export const AdminRoutes = router;
