import { ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client"; // Import Prisma errors
import { ZodError } from "zod";
import { AppError } from "../utills/error";

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, next): void => {
  let errorStatus = err instanceof AppError ? err.status : 500;
  let errorMessage = err instanceof AppError ? err.message : "Something went wrong!";

  // ✅ Zod Validation Error Handling
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      status: 400,
      message: "Validation Error",
      errors: err.errors.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  // ✅ Prisma-Specific Error Handling
  const prismaErrorMap: Record<string, { status: number; message: string }> = {
    P2002: { status: 409, message: "A record with this data already exists." }, // Unique constraint violation
    P2025: { status: 404, message: "The requested record was not found." }, // Record not found
  };

  if (err instanceof Prisma.PrismaClientKnownRequestError && prismaErrorMap[err.code]) {
    errorStatus = prismaErrorMap[err.code].status;
    errorMessage = prismaErrorMap[err.code].message;
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    errorStatus = 400;
    errorMessage = "Invalid data provided.";
  } else if (
    err instanceof Prisma.PrismaClientUnknownRequestError ||
    err instanceof Prisma.PrismaClientRustPanicError ||
    err instanceof Prisma.PrismaClientInitializationError
  ) {
    errorStatus = 500;
    errorMessage = "A database error occurred.";
  }

  // ✅ Final Error Response
  res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    details: err.message, // 🔥 Log Prisma's full error message
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
