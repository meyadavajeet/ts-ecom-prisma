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

export default startupRoutes;
