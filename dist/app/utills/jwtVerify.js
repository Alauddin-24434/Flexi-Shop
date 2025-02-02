"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtVerify = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const error_1 = require("./error");
// jwt verify
const jwtVerify = (refreshToken) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, config_1.default.JWT_SECRET.JWT_REFRESH_SECRET);
        return decoded;
    }
    catch (error) {
        throw new error_1.AppError(401, "Invalid token");
    }
};
exports.jwtVerify = jwtVerify;
