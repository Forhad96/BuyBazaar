import { Router } from "express";
import { CategoryController } from "./category.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router()

router.get('/',CategoryController.getAllCategories)

router.post('/create-category', CategoryController.createCategory)

router.patch('/update-category/:id',auth(UserRole.SUPERADMIN,UserRole.ADMIN), CategoryController.updateCategory)

router.delete('/delete-category/:id',auth(UserRole.SUPERADMIN,UserRole.ADMIN), CategoryController.deleteCategory)
export const CategoryRoutes = router