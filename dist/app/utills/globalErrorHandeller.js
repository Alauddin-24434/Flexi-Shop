"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandelelr = void 0;
const globalErrorHandelelr = (err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: process.env.NODE_ENV === "development" ? err.stack : {},
    });
};
exports.globalErrorHandelelr = globalErrorHandelelr;
