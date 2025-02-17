"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const client_1 = require("@prisma/client"); // Import Prisma errors
const zod_1 = require("zod");
const error_1 = require("../utills/error");
const globalErrorHandler = (err, req, res, next) => {
    let errorStatus = err instanceof error_1.AppError ? err.status : 500;
    let errorMessage = err instanceof error_1.AppError ? err.message : "Something went wrong!";
    // ✅ Zod Validation Error Handling
    if (err instanceof zod_1.ZodError) {
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
    const prismaErrorMap = {
        P2002: { status: 409, message: "A record with this data already exists." }, // Unique constraint violation
        P2025: { status: 404, message: "The requested record was not found." }, // Record not found
    };
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError && prismaErrorMap[err.code]) {
        errorStatus = prismaErrorMap[err.code].status;
        errorMessage = prismaErrorMap[err.code].message;
    }
    else if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        errorStatus = 400;
        errorMessage = "Invalid data provided.";
    }
    else if (err instanceof client_1.Prisma.PrismaClientUnknownRequestError ||
        err instanceof client_1.Prisma.PrismaClientRustPanicError ||
        err instanceof client_1.Prisma.PrismaClientInitializationError) {
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
exports.globalErrorHandler = globalErrorHandler;
