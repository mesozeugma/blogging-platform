import { HttpException } from "./http-exception";

export class NotFoundException extends HttpException {
  name = NotFoundException.name;

  constructor(message: string = "Not found") {
    super(404, message);
  }
}
