import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from 'http-status';
import { PaymentServices } from "./payment.service";
const processPayment = catchAsync(async (req, res) => {
    const result = await PaymentServices.processPayment(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payment processed successfully",
        data: result,
    })
});


export const PaymentControllers = {
    processPayment
}