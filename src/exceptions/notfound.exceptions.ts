import { ErrorCode, HTTPException } from "./root.exceptions";

export class NotFoundException extends HTTPException {
  constructor(message: string, errorCode: ErrorCode) {
    super(404, errorCode, message, null);
  }
}