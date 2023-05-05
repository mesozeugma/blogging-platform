import { HttpException } from "./http-exception";

export class BadRequestException extends HttpException {
  name = BadRequestException.name;

  constructor(message: string = "Bad request") {
    super(400, message);
  }
}
