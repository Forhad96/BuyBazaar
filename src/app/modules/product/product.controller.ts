import { send } from "process";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { productFilterAbleFields } from "./product.constant";
import { ProductServices } from "./product.service";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import { IAuthUser } from "../../interfaces/common";
import { Request, Response } from "express";

const getAllProducts = catchAsync(async (req, res) => {
    const filterData = pick(req.query, productFilterAbleFields);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

    const result = await ProductServices.getAllProducts(filterData,options);
sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Products retrieved successfully",
    meta: result.meta,
    data: result.data,  
})
})

const getAllSpecificVendorProducts = catchAsync(async (req, res) => {
    const filterData = pick(req.query, productFilterAbleFields);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const {vendorId} = req.params
    const result = await ProductServices.getAllSpecificVendorProducts(vendorId,filterData,options);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Products retrieved successfully",
        data: result,
    })
})


const getProductById = catchAsync(async (req: Request & {user?: IAuthUser}, res: Response) => {
    const {id} = req.params
    const user = req?.user as IAuthUser

    const result = await ProductServices.getProductById(id,user?.role as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Product retrieved successfully",
        data: result,
    })
})

const createProduct= catchAsync(async (req, res) => {
    const files = (req.files as Express.Multer.File[]).map((file) => file.path);


    const result = await ProductServices.createProduct(files,req.body);
    res.status(httpStatus.OK).json({
        success: true,
        message: "Product created successfully",
        data: result,
    });
})
const updateProduct = catchAsync(async (req, res) => {
    const files = (req.files as Express.Multer.File[]).map((file) => file.path);
    const {id} = req.params

    const result = await ProductServices.updateProduct(id,files,req.body);
sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product updated successfully",
    data: result,
})
})

const deleteProduct = catchAsync(async (req, res) => {
    const {id} = req.params
    const result = await ProductServices.deleteProduct(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product deleted successfully",
    data: result,
  })
})

export const ProductControllers = {
    createProduct,
    getAllProducts,
    getAllSpecificVendorProducts,
    getProductById,
    updateProduct,
    deleteProduct
}