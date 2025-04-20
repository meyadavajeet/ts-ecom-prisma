import { Router } from "express"; 
import { errorHandler } from "../error.handler";
import authMiddleware from "../middlewares/auth.middleware";
import { addItemToCart, getCart, removeItemFromCart, updateItemInCart } from "../controllers/cart.controller";

const cartRouter: Router = Router();

cartRouter.post("/", [authMiddleware], errorHandler(addItemToCart));
cartRouter.get("/", [authMiddleware], errorHandler(getCart));
cartRouter.delete("/:id", [authMiddleware], errorHandler(removeItemFromCart));
cartRouter.put("/:id", [authMiddleware], errorHandler(updateItemInCart));

export default cartRouter;