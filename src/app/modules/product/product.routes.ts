import { Router } from "express";
import { ProductControllers } from "./product.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ProductValidationSchemas } from "./product.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../../helpers/fileUploader";
import { parseFormData } from "../../../helpers/parseFormData";

const router = Router();

router.get("/", ProductControllers.getAllProducts);
router.post(
  "/create-product",
  auth(UserRole.VENDOR),
  fileUploader.upload.array("files"),
  parseFormData(ProductValidationSchemas.productSchema),
  // validateRequest(),
  ProductControllers.createProduct
);

export const ProductRoutes = router;
