import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { errorHandler } from "../error.handler";
import {
  addAddress,
  changeUserRole,
  deleteAddress,
  getAddressById,
  getAllUsers,
  getUserById,
  listAllAddress,
  updateAddress,
  updateUser,
} from "../controllers/user.controller";
import adminMiddleware from "../middlewares/admin.middleware";

const userRouter: Router = Router();

userRouter.post("/address", [authMiddleware], errorHandler(addAddress));
userRouter.get("/address", [authMiddleware], errorHandler(listAllAddress));
userRouter.get("/address/:id", [authMiddleware], errorHandler(getAddressById));
userRouter.put("/address/:id", [authMiddleware], errorHandler(updateAddress));
userRouter.delete(
  "/address/:id",
  [authMiddleware],
  errorHandler(deleteAddress)
);
userRouter.put("/", [authMiddleware], errorHandler(updateUser));

// The user routes for the admin part wth admin middleware
userRouter.get(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(getUserById)
);
userRouter.get(
  "/",
  [authMiddleware, adminMiddleware],
  errorHandler(getAllUsers)
);

userRouter.put(
  "/:id/roles",
  [authMiddleware, adminMiddleware],
  errorHandler(changeUserRole)
);

export default userRouter;
