import { Router } from "express";
import authRouter from "./auth.routes";
import productRoutes from "./product.routes";

const startupRoutes: Router = Router();

startupRoutes.use("/auth", authRouter);
startupRoutes.use("/product", productRoutes);

export default startupRoutes;
