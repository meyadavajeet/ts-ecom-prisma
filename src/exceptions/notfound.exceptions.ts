import { ErrorCode, HTTPException } from "./root.exceptions";

export class NotFoundException extends HTTPException {
  constructor(message: string, errorCode: ErrorCode, error: any | null = null) {
    super(404, errorCode, message, error);
  }
}