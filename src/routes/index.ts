import { Router } from "express";
import authRouter from "./auth.routes";

const startupRoutes : Router = Router();

startupRoutes.use("/auth", authRouter)

export default startupRoutes;