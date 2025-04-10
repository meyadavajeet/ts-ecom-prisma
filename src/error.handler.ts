import { NextFunction, Request, Response } from "express";
import { ErrorCode, HTTPException } from "./exceptions/root.exceptions";
import { InternalServerException } from "./exceptions/internalserver.exceptions";

// Add this BigInt serialization utility
const bigIntSerializer = () => {
  // Adding BigInt support to JSON.stringify
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };
};

export const errorHandler = (method: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Add BigInt serialization support
      bigIntSerializer();
      await method(req, res, next);
    } catch (error: any) {
      let exception: HTTPException;
      if (error instanceof HTTPException) {
        exception = error;
      } else {
        console.log(error);
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
