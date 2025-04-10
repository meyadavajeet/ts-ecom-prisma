import { Router } from "express";
import authRouter from "./auth.routes";
import productRoutes from "./product.routes";
import userRouter from "./user.routes";

const startupRoutes: Router = Router();

startupRoutes.use("/auth", authRouter);
startupRoutes.use("/product", productRoutes);
startupRoutes.use("/user", userRouter);

export default startupRoutes;
