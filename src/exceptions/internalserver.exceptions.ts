import { ErrorCode, HTTPException } from "./root.exceptions";

export class InternalServerException extends HTTPException {
  constructor(message: string, errorCode: ErrorCode, error: any | null = null) {
    super(500, errorCode, message, error);
  }
}
