import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { OrderControllers } from "./order.controller";

const router = Router()


router.post('/create-order',auth(UserRole.CUSTOMER), OrderControllers.createOrder)



export const OrderRoutes = router