import { Router } from "express";
import {signin, signup} from "../controllers/auth.controller";

const authRouter: Router = Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);

export default authRouter;
