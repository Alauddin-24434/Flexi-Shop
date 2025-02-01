import { NextFunction, Request, Response } from "express";
import { AppError } from "./error";

export const globalErrorHandelelr = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorStatus = err.status|| 500;

  const errorMessage = err.message || "Something went wrong!";

  res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: process.env.NODE_ENV === "development" ? err.stack : {},
  });
};
