import { HttpException } from "./http-exception";

export class ForbiddenException extends HttpException {
  name = ForbiddenException.name;

  constructor(message: string = "Access denied") {
    super(403, message);
  }
}
