"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTokensAndCookies = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
// set tokens and cookies for user
const setTokensAndCookies = (res, payload) => {
    // generate tokens for user passing id, email and role
    const accessToken = jsonwebtoken_1.default.sign({ id: payload.id, email: payload.email, role: payload.role }, config_1.default.JWT_SECRET.JWT_ACCESS_SECRET, {
        expiresIn: "1h", // 1 hour
    });
    const refreshToken = jsonwebtoken_1.default.sign({ id: payload.id, email: payload.email, role: payload.role }, config_1.default.JWT_SECRET.JWT_REFRESH_SECRET, {
        expiresIn: "7d", // 7 days
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return { accessToken, refreshToken };
};
exports.setTokensAndCookies = setTokensAndCookies;
