import { JWT_SECRET } from "./../configs/secrets";
import * as jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { UnAuthorizedException } from "../exceptions/unauthorized.exceptions";
import { ErrorCode } from "../exceptions/root.exceptions";
import { prismaClient } from "../app";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if the request has an authorization header
  const token = req.headers["authorization"]?.split(" ")[1];
  // If no token is provided, return an unauthorized response

  if (!token) {
    next(new UnAuthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
    return;
  }
  try {
    // Verify the token (this is a placeholder, implement your own verification logic)
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded) {
      next(new UnAuthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
      return;
    }
    // Attach user information to the request object
    const user = await prismaClient.user.findFirst({
      where: { id: decoded.id },
    });

    if (!user) {
      next(new UnAuthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
      return;
    }
    req.user = user;
    next(); // Call the next middleware or route handler
  } catch (error) {
    next(new UnAuthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
    return;
  }
};

export default authMiddleware;
