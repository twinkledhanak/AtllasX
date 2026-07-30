import { Request, Response, NextFunction } from "express";

export const requestElapsedTime = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`Printing Elapsed Time for:[${req.method}] ${req.originalUrl} - ${duration}ms`);
  });

  next();
};