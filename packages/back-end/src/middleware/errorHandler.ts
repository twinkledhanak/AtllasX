import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { failure } from "../response/app.response";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message,       
    details: err.details,     
  });
};