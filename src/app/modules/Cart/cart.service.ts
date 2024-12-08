import { OrderItem } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";

// Add product to cart
const addProductToCart = async (user: IAuthUser, payload: OrderItem) => {
  // If the product item is already in the cart, then just increase the quantity
  // If the product item is not in the cart, then create a new cart item
  const existingCartItem = await prisma.cartItem.upsert({
    where: {
      customerEmail_productId: {
        customerEmail: user?.email as string,
        productId: payload?.productId,
      },
    },
    // If the product item is already in the cart, then just increase the quantity
    update: {
      quantity: {
        increment: payload.quantity,
      },
    },
    // If the product item is not in the cart, then create a new cart item
    create: {
      customerEmail: user?.email as string,
      productId: payload.productId,
      quantity: payload.quantity,
    },
    include: {
      product: true,
    },
  });

  // update the inventory of the product
  // await prisma.product.update({
  //   where: {
  //     id: payload.productId,
  //   },
  //   data: {
  //     inventory: {
  //       decrement: payload.quantity,
  //     },
  //   },
  // });

  return existingCartItem;
};
const removeProductFromCart = async (user: IAuthUser, productId: string) => {
  const result = await prisma.cartItem.deleteMany({
    where: {
      customerEmail: user?.email as string,
      productId,
    },
  });

  return result;
};

const updateProductQuantity = async (
  user: IAuthUser,
  productId: string,
  quantity: number
) => {
  // check if the product item is in the cart
  await prisma.cartItem.findUniqueOrThrow({
    where: {
      customerEmail_productId: {
        customerEmail: user?.email as string,
        productId,
      },
    },
  });

  const result = await prisma.cartItem.updateMany({
    where: {
      customerEmail: user?.email as string,
      productId,
    },
    data: {
      quantity,
    },
  });

  return result;
};
export const CartServices = {
  addProductToCart,
  removeProductFromCart,
  updateProductQuantity,
};
