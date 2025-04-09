import { Router } from "express";
import { me, signin, signup } from "../controllers/auth.controller";
import { errorHandler } from "../error.handler";
import authMiddleware from "../middlewares/auth.middleware";

const authRouter: Router = Router();

authRouter.post("/signup", errorHandler(signup));
authRouter.post("/signin", errorHandler(signin));
authRouter.get("/me", authMiddleware, errorHandler(me));

export default authRouter;
