import { OrderItem } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";

const createOrder = async (user: IAuthUser, payload: OrderItem) => {
  //   const result = await prisma.order.create({
  //     data: {
  //       customerEmail: user?.email,
  //     },
  //   });
  //   return result;
};

const addProductToCart = async (user: IAuthUser, payload: OrderItem) => {
  console.log(payload);
  const product = await prisma.product.findUniqueOrThrow({
    where: {
      id: payload.productId,
    },
  });

  const existingCartItem = await prisma.cartItem.upsert({
    where: {
      customerEmail_productId: {
        customerEmail: user?.email as string,
        productId: payload?.productId,
      },
    },
    update: {
      quantity: {
        increment: payload.quantity,
      },
    },
    create: {
      customerEmail: user?.email as string,
      productId: payload.productId,
      quantity: payload.quantity,
    },
    include: {
      product: true,
    },
  });

  await prisma.product.update({
    where: {
      id: payload.productId,
    },
    data: {
      inventory: {
        decrement: payload.quantity,
      },
    },
  });

  return existingCartItem;
};

export const OrderServices = {
  createOrder,
  addProductToCart,
};
