import { Router } from "express";

const orderRouter: Router = Router();

import {
  createOrder,
  getOrderById,
  getAllOrders,
  cancelOrder,
  listAllOrders,
  listUsersOrders,
  changeStatus,
} from "../controllers/order.controller";
import { errorHandler } from "../error.handler";
import authMiddleware from "../middlewares/auth.middleware";
import adminMiddleware from "../middlewares/admin.middleware";

orderRouter.post("/", [authMiddleware], errorHandler(createOrder));
orderRouter.get("/", [authMiddleware], errorHandler(getAllOrders));
orderRouter.put("/:id/cancel", [authMiddleware], errorHandler(cancelOrder));

// The order routes for the admin part with admin middleware
orderRouter.get("/index", [authMiddleware, adminMiddleware], errorHandler(listAllOrders));
orderRouter.get("/users", [authMiddleware, adminMiddleware], errorHandler(listUsersOrders));
orderRouter.put("/:id/status", [authMiddleware, adminMiddleware], errorHandler(changeStatus));

orderRouter.get("/:id", [authMiddleware], errorHandler(getOrderById));
export default orderRouter;
