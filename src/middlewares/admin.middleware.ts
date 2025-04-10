import { NextFunction, Request, Response } from "express";
import { UnAuthorizedException } from "../exceptions/unauthorized.exceptions";
import { ErrorCode } from "../exceptions/root.exceptions";

const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (!user) {
    next(new UnAuthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED, "Please provide authorization token"));
    return;
  }
  if (user.role.toLowerCase() !== "admin") {
    next(new UnAuthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED, "Not an admin"));
    return;
  }
  next(); // Call the next middleware or route handler
};

export default adminMiddleware;
