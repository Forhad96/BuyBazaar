import { processSSLCommerzPayment } from "./processSSLCommerzPayment";

const processPayment = async (payload: any): Promise<any> => {
    const paymentResponse = await processSSLCommerzPayment(payload);
console.log(paymentResponse);

    // return paymentResponse || null;
}


export const PaymentServices = {
    processPayment
}