import { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * Helper for handling exceptions inside of async express routes
 */
export const asyncHandler =
  (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
