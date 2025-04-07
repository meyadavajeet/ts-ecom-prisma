import { ErrorCode, HTTPException } from "./root.exceptions";

export class BadRequestException extends HTTPException {
  constructor(message: string, errorCode: ErrorCode) {
    super(400, errorCode, message, null);
  }
}
