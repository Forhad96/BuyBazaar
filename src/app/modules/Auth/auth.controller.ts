import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AuthServices } from "./auth.service";
import httpStatus from 'http-status';
const loginUser = catchAsync(async (req:Request, res:Response) => {
  const result = await AuthServices.loginUser(req.body);
  res.cookie("refreshToken", result.refreshToken,{
    secure:false,
    httpOnly:true,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User login successful",
    data: {
      accessToken: result.accessToken,
      needPasswordChange: result.needPasswordChange,
    },
  });
});
const refreshToken = catchAsync(async (req:Request, res:Response) => {
  const {refreshToken} = req.cookies
  
  // console.log(refreshToken);
  const result = await AuthServices.refreshToken(refreshToken);
  


  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User login successful",
    data: result
    // data: {
    //   accessToken: result.accessToken,
    //   needPasswordChange: result.needPasswordChange,
    // },
  });
});


const changePassword = catchAsync(async (req:Request & {user?:any}, res:Response) => {
  const {user} = req
  const result = await AuthServices.changePassword(user,req.body);
  


  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password change successfully",
    data: result
  });
});
const forgotPassword = catchAsync(async (req:Request, res:Response) => {

  const result = await AuthServices.forgotPassword(req.body);
  


  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Check your Email",
    data: result
  });
});

const resetPassword = catchAsync(async(req:Request,res:Response)=>{
  const token = req.headers.authorization as string;
  const result = await AuthServices.resetPassword(token,req.body);
  


  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successful",
    data: result
  });
})
export const AuthController = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword
};
