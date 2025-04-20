import { Router } from "express";
import { errorHandler } from "../error.handler";
import {
  createProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
  searchProduct,
  updateProduct,
} from "../controllers/product.controller";
import authMiddleware from "../middlewares/auth.middleware";
import adminMiddleware from "../middlewares/admin.middleware";
const productRoutes: Router = Router();

productRoutes.post(
  "/",
  [authMiddleware, adminMiddleware],
  errorHandler(createProduct)
);

productRoutes.get(
  "/",
  [authMiddleware, adminMiddleware],
  errorHandler(getAllProducts)
);
// search product fulltext search
productRoutes.get(
  "/search",
  [authMiddleware],
  errorHandler(searchProduct)
);
productRoutes.get(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(getProductById)
);
productRoutes.put(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(updateProduct)
);
productRoutes.delete(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(deleteProductById)
);

export default productRoutes;
