import { Router } from "express";
import { PaymentControllers } from "./payment.controller";

const router = Router()

router.post("/process-payment", PaymentControllers.processPayment)


export const PaymentRoutes = router