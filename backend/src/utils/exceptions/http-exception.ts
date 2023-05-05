import { Response } from "express";

export abstract class HttpException implements Error {
  abstract name: string;
  statusCode: number;
  message: string;

  constructor(statusCode: number, message: string) {
    this.statusCode = statusCode;
    this.message = message;
  }

  sendResponse(res: Response) {
    return res.status(this.statusCode).json({ errorMessage: this.message });
  }
}
