import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { productFilterAbleFields } from "./product.constant";
import { ProductServices } from "./product.service";
import httpStatus from "http-status";

const getAllProducts = catchAsync(async (req, res) => {
    const filterData = pick(req.query, productFilterAbleFields);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

    const result = await ProductServices.getAllProducts(filterData,options);
    res.status(httpStatus.OK).json({
        success: true,
        message: "Products retrieved successfully",
        data: result,
    });
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
    res.status(httpStatus.OK).json({
        success: true,
        message: "Product updated successfully",
        data: result,
    });
})

export const ProductControllers = {
    createProduct,
    getAllProducts,
    updateProduct
}