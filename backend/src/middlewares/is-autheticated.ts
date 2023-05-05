import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../utils/exceptions/unauthorized-exception";

export function isAuthenticated(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  if (!req.isAuthenticated()) throw new UnauthorizedException();
  next();
}
