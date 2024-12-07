import { Router } from "express";
import { CategoryController } from "./category.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router()


router.post('/create-category', CategoryController.createCategory)

router.patch('/update-category/:id',auth(UserRole.SUPERADMIN), CategoryController.updateCategory)

export const CategoryRoutes = router