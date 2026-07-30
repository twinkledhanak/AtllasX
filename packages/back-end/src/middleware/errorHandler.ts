import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { failure } from "../response/app.response";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(failure(err.message, err.errors));
  }
  console.error(err); // unexpected error — log it
  return res.status(500).json(failure("Internal server error"));
};