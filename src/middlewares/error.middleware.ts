import { NextFunction, Request, Response } from "express";
import { HTTPException } from "../exceptions/root.exceptions";

export const errorMiddleware = (
  error: HTTPException,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error.";
  const errorCode = error.errorCode || "INTERNAL_SERVER_ERROR";

  res.status(statusCode).json({
    statusCode,
    errorCode,
    message,
    error: error.error,
  });
};
