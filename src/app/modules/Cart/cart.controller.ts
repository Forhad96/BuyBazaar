import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { IAuthUser } from "../../interfaces/common";
import { CartServices } from "./cart.service";
import httpStatus from "http-status";

// Add product to cart
const addProductToCart = catchAsync(
    async (req: Request & { user?: IAuthUser }, res: Response) => {
      const user = req.user as IAuthUser;
  
      const result = await CartServices.addProductToCart(user, req.body);
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Product added to cart successfully",
        data: result,
      });
    }
  );

  //remove product from cart
  const removeProductFromCart = catchAsync(
    async (req: Request & { user?: IAuthUser }, res: Response) => {
      const user = req.user as IAuthUser;
  const productId = req.params.productId
      const result = await CartServices.removeProductFromCart(user, productId);
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Product removed from cart successfully",
        data: result,
      });
    }
  )

//Update product quantity
const updateProductQuantity = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user as IAuthUser;
    const productId = req.params.productId;
    const quantity = req.body.quantity;

    const result = await CartServices.updateProductQuantity(user, productId, quantity);    
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Product quantity updated successfully",
      data: result, 
    })
  }
)


  export const CartController = {
    addProductToCart,
    removeProductFromCart,
    updateProductQuantity
  };