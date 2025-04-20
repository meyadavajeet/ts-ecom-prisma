import { ErrorCode, HTTPException } from "./root.exceptions";
export class UnprocessableEntity extends HTTPException {
  constructor(error: any, errorCode: ErrorCode, message: string,) {
    super(422, errorCode, message, error);
  }
}
