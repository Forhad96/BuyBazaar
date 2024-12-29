import { Router } from "express";
import { AdminController } from "./admin.controller";
import validateRequest from "../../middlewares/validateRequest";
import { adminValidationSchemas } from "./admin.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get("/", auth(UserRole.ADMIN,UserRole.SUPERADMIN) ,AdminController.getAllUsers);

router.get("/:id",auth(UserRole.ADMIN,UserRole.SUPERADMIN), AdminController.getByIdFromDB);

router.patch(
  "/:id",auth(UserRole.ADMIN,UserRole.SUPERADMIN),
  validateRequest(adminValidationSchemas.zUpdateSchema),
  AdminController.updateIntoDB
);

router.delete("/:id",auth(UserRole.ADMIN,UserRole.SUPERADMIN), AdminController.deleteFromDB);

router.delete("/soft/:id",auth(UserRole.ADMIN,UserRole.SUPERADMIN), AdminController.softDeleteFromDB);

export const AdminRoutes = router;
