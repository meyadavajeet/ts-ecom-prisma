import { Router } from "express";
import authRouter from "./auth.routes";
import productRoutes from "./product.routes";
import userRouter from "./user.routes";
import cartRouter from "./cart.routes";
import orderRouter from "./order.routes";

const startupRoutes: Router = Router();

startupRoutes.use("/auth", authRouter);
startupRoutes.use("/product", productRoutes);
startupRoutes.use("/user", userRouter);
startupRoutes.use("/cart", cartRouter);
startupRoutes.use("/order", orderRouter);

/**
 * TODO:
 * 1. User Management
 *  - list all users
 *  - get user by id
 *  - change user role
 *
 * 2. Order Management
 *  - list all orders (filter on status)
 *  - change order status
 *  - list all orders for a given user
 *
 * 3. Product Management
 *  - Search API for products (for both admin and users) -> Full text search
 */

export default startupRoutes;
