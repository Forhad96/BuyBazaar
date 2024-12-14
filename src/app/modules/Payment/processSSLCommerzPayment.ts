import express from "express";
import SSLCommerzPayment from "sslcommerz-lts";

const app = express();

//sslcommerz init
const store_id = "teamd65ca015f2541a";
const store_passwd = "teamd65ca015f2541a@ssl";
const is_live = false; //true for live, false for sandbox

// const calculateAmount = (planName) => {
//   let amount = 0;
//   if (planName === "basic") {
//     amount = 100 * 12;
//   } else if (planName === "enterprise") {
//     amount = 10 * 30;
//   } else if (planName === "pro") {
//     amount = 100 * 23;
//   }
//   return amount;
// };

const port = 3030;

//sslcommerz init
export const processSSLCommerzPayment = async (
  paymentData: Partial<IProcessSSLCommerzPayment>
) => {
  console.log(paymentData);

  const data = {
    total_amount: paymentData.total_amount,
    currency: "BDT",
    tran_id: "REF123", // use unique tran_id for each api call
    success_url: "http://localhost:3030/success",
    fail_url: "http://localhost:3030/fail",
    cancel_url: "http://localhost:3030/cancel",
    ipn_url: "http://localhost:3030/ipn",
    shipping_method: "Courier",
    product_name: "Computer.",
    product_category: "Electronic",
    product_profile: "general",
    cus_name: "Customer Name",
    cus_email: "customer@example.com",
    cus_add1: "Dhaka",
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: "01711111111",
    cus_fax: "01711111111",
    ship_name: "Customer Name",
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };

  try {
    let GatewayPageURL = "";
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    sslcz.init(data).then((apiResponse: any) => {
      // Redirect the user to payment gateway
       GatewayPageURL = apiResponse.GatewayPageURL;
      // console.log(GatewayPageURL);
      console.log("Redirecting to: ", GatewayPageURL);
    });
    return { GatewayPageURL };
  } catch (error) {
    console.log(error);
  }
};
