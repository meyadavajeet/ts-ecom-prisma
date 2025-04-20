import { Router } from "express";

const orderRouter: Router = Router();

import {
  createOrder,
  getOrderById,
  getAllOrders,
  cancelOrder,
} from "../controllers/order.controller";
import { errorHandler } from "../error.handler";
import authMiddleware from "../middlewares/auth.middleware";

orderRouter.post("/", [authMiddleware], errorHandler(createOrder));
orderRouter.get("/", [authMiddleware], errorHandler(getAllOrders));
orderRouter.get("/:id", [authMiddleware], errorHandler(getOrderById));
orderRouter.put("/:id/cancel", [authMiddleware], errorHandler(cancelOrder));

export default orderRouter;
