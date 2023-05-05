import { HttpException } from "./http-exception";

export class InternalServerErrorException extends HttpException {
  name = InternalServerErrorException.name;
  error: Error;

  constructor(error: Error, message: string = "Internal server error") {
    super(500, message);
    this.error = error;
  }
}
