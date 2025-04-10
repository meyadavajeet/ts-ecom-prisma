import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { errorHandler } from "../error.handler";
import {
  addAddress,
  deleteAddress,
  listAllAddress,
  updateAddress,
} from "../controllers/user.controller";

const userRouter: Router = Router();

userRouter.get("/address", [authMiddleware], errorHandler(addAddress));
userRouter.post("/address", [authMiddleware], errorHandler(listAllAddress));
userRouter.put("/address/:id", [authMiddleware], errorHandler(updateAddress));
userRouter.delete("/address/:id", [authMiddleware], errorHandler(deleteAddress));

export default userRouter;
