import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { CartController } from "./cart.controller";

const router = Router();
router.post(
  "/add-product-to-cart",
  auth(UserRole.CUSTOMER),
  CartController.addProductToCart
);
router.delete(
  "/remove-product-from-cart/:productId",
  auth(UserRole.CUSTOMER),
  CartController.removeProductFromCart
)
//update product quantity
router.patch(
  "/update-cart-product-quantity/:productId",
  auth(UserRole.CUSTOMER),
  CartController.updateProductQuantity
)

export const CartRoutes = router;
