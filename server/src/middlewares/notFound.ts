import { Request, Response, NextFunction } from "express";

// Extend the default Error type to include `status`
interface CustomError extends Error {
  status?: number;
}

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error: CustomError = new Error(`Route ${req.originalUrl} not found`);
  error.status = 404;
  next(error);
};
