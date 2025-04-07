import { NextFunction, Request, Response } from "express";
import { ErrorCode, HTTPException } from "./exceptions/root.exceptions";
import { InternalServerException } from "./exceptions/internalserver.exceptions";

export const errorHandler = (method: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
     await method(req, res, next);
    } catch (error: any) {
      let exception: HTTPException;
      if (error instanceof HTTPException) {
        exception = error;
      } else {
        exception = new InternalServerException(
          "Internal server error.",
          ErrorCode.INTERNAL_SERVER_ERROR,
          error
        );
      }
      next(exception);
    }
  };
};
