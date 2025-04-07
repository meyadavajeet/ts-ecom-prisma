import { Router } from "express";
import { signin, signup } from "../controllers/auth.controller";
import { errorHandler } from "../error.handler";

const authRouter: Router = Router();

authRouter.post("/signup", errorHandler(signup));
authRouter.post("/signin", errorHandler(signin));

export default authRouter;
