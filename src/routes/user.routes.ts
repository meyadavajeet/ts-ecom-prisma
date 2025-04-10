import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { errorHandler } from "../error.handler";
import {
  addAddress,
  deleteAddress,
  getAddressById,
  listAllAddress,
  updateAddress,
} from "../controllers/user.controller";

const userRouter: Router = Router();

userRouter.post("/address", [authMiddleware], errorHandler(addAddress));
userRouter.get("/address", [authMiddleware], errorHandler(listAllAddress));
userRouter.get("/address/:id", [authMiddleware], errorHandler(getAddressById));
userRouter.put("/address/:id", [authMiddleware], errorHandler(updateAddress));
userRouter.delete("/address/:id", [authMiddleware], errorHandler(deleteAddress));

export default userRouter;
