import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { CartControllers } from "./cart.controller";

const router = Router();

//get my cart
router.get("/get-my-cart", auth(UserRole.CUSTOMER), CartControllers.getMyCart);

//add product to cart
router.post(
  "/add-product-to-cart",
  auth(UserRole.CUSTOMER),
  CartControllers.addProductToCart
);


//remove product from cart
router.delete(
  "/remove-product-from-cart/:productId",
  auth(UserRole.CUSTOMER),
  CartControllers.removeProductFromCart
)
//update product quantity
router.patch(
  "/update-cart-product-quantity/:productId",
  auth(UserRole.CUSTOMER),
  CartControllers.updateProductQuantity
)

export const CartRoutes = router;
