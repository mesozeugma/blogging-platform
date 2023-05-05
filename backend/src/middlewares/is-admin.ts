import { NextFunction, Request, Response } from "express";
import { ForbiddenException } from "../utils/exceptions/forbidden-exceptiony";
import { getRequestUser } from "./passport";

export function isAdmin(req: Request) {
  const user = getRequestUser(req);
  return !!user.isAdmin;
}

export function isAdminMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  if (!isAdmin(req)) {
    throw new ForbiddenException();
  }
  next();
}
