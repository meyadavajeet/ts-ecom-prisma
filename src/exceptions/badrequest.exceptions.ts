import { ErrorCode, HTTPException } from "./root.exceptions";

export class BadRequestException extends HTTPException {
  constructor(message: string, errorCode: ErrorCode, error: any | null = null) {
    super(400, errorCode, message, error);
  }
}
