import { Router } from "express";
import { errorHandler } from "../error.handler";
import { createProduct } from "../controllers/product.controller";
import authMiddleware from "../middlewares/auth.middleware";
import adminMiddleware from "../middlewares/admin.middleware";
const productRoutes: Router = Router();

productRoutes.post(
  "/create",
  [authMiddleware, adminMiddleware],
  errorHandler(createProduct)
);

export default productRoutes;
