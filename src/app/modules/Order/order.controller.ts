import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { IAuthUser } from "../../interfaces/common";
import { OrderServices } from "./order.service";
import httpStatus from "http-status";
const createOrder = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const payload = req.body;
    const user = req.user as IAuthUser;
    const result = await OrderServices.createOrder(user, payload);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Order created successfully",
      data: result,
    });
  }
);

const addProductToCart = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user as IAuthUser;

    const result = await OrderServices.addProductToCart(user, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Product added to cart successfully",
      data: result,
    });
  }
);
export const OrderControllers = {
  createOrder,
  addProductToCart,
};
