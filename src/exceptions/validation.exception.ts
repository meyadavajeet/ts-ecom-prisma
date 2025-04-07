import { ErrorCode, HTTPException } from "./root.exceptions";
export class UnprocessableEntity extends HTTPException {
  constructor(error: any, message: string, errorCode: ErrorCode) {
    super(422, errorCode, message, error);
  }
}
