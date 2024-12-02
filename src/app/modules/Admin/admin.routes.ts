import { Router } from "express";
import { AdminController } from "./admin.controller";
import validateRequest from "../../middlewares/validateRequest";
import { adminValidationSchemas } from "./admin.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get("/", auth(UserRole.ADMIN,UserRole.SUPER_ADMIN) ,AdminController.getAllFromDB);

router.get("/:id",auth(UserRole.ADMIN,UserRole.SUPER_ADMIN), AdminController.getByIdFromDB);

router.patch(
  "/:id",auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),
  validateRequest(adminValidationSchemas.zUpdateSchema),
  AdminController.updateIntoDB
);

router.delete("/:id",auth(UserRole.ADMIN,UserRole.SUPER_ADMIN), AdminController.deleteFromDB);

router.delete("/soft/:id",auth(UserRole.ADMIN,UserRole.SUPER_ADMIN), AdminController.softDeleteFromDB);

export const AdminRoutes = router;
