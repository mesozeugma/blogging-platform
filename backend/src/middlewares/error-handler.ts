import { NextFunction, Request, Response } from "express";
import { HttpException } from "../utils/exceptions/http-exception";
import { InternalServerErrorException } from "../utils/exceptions/internal-server-error.exception";

export function errorHandlerMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent) {
    return next(err);
  }
  if (err instanceof InternalServerErrorException) {
    console.log(err.error);
  }
  if (err instanceof HttpException) {
    return err.sendResponse(res);
  }
  console.log(err);
  return new InternalServerErrorException(err).sendResponse(res);
}
