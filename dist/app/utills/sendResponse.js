"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (statusCode, success, message, data, res) => {
    res.status(statusCode).json({
        status: statusCode,
        success: success,
        message,
        data,
    });
};
exports.sendResponse = sendResponse;
