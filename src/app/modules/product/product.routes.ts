import { Router } from "express";
import { ProductControllers } from "./product.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ProductValidationSchemas } from "./product.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get("/", ProductControllers.getAllProducts);
router.post(
  "/create-product",
  auth(UserRole.Vendor),
  validateRequest(ProductValidationSchemas.createProductSchema),
  ProductControllers.createProduct
);

export const ProductRoutes = router;
