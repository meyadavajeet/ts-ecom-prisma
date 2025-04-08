import { ErrorCode, HTTPException } from "./root.exceptions";

export class UnAuthorizedException extends HTTPException {
  constructor(message: string, errorCode: ErrorCode, error: any | null = null) {
    super(401, errorCode, message, error);
  }
}
