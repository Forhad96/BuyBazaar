import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { OrderControllers } from "./order.controller";

const router = Router()

// get all orders
router.get('/get-all-orders',auth(UserRole.ADMIN,UserRole.SUPERADMIN,UserRole.VENDOR,UserRole.CUSTOMER),OrderControllers.getAllOrders)
router.post('/create-order',auth(UserRole.CUSTOMER),OrderControllers.createOrder)



export const OrderRoutes = router