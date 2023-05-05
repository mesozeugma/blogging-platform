import { HttpException } from "./http-exception";

export class UnauthorizedException extends HttpException {
  name = UnauthorizedException.name;

  constructor(message: string = "Unauthorized") {
    super(401, message);
  }
}
