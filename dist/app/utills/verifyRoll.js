"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRoll = void 0;
const error_1 = require("../utills/error");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const verifyRoll = (roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const token = req.cookies.accessToken || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]);
        if (!token) {
            throw new error_1.AppError(401, "Authentication required");
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET.JWT_ACCESS_SECRET);
            // find user in the database
            const user = yield prisma.user.findUnique({
                where: { id: decoded.id },
            });
            if (!user) {
                throw new error_1.AppError(404, "Resource not found");
            }
            if (!roles.includes(user.role)) {
                throw new error_1.AppError(403, "Access denied");
            }
            next();
        }
        catch (error) {
            next(error);
        }
    });
};
exports.verifyRoll = verifyRoll;
