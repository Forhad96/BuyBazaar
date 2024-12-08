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





export const OrderServices = {
  createOrder,
};
