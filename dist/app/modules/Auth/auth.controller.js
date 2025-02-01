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
exports.createUser = void 0;
const sendResponse_1 = require("../../utills/sendResponse");
const catchAsync_1 = require("../../utills/catchAsync");
const client_1 = require("@prisma/client");
const error_1 = require("../../utills/error");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
// createUser
exports.createUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { email, password, role } = body;
    // isUserExist
    const isUserExist = yield prisma.user.findUnique({
        where: {
            email: email,
        },
    });
    // user chek
    if (isUserExist) {
        throw new error_1.AppError(400, "User already exist");
    }
    const hashPassword = yield bcryptjs_1.default.hash(password, 10);
    // crate new user
    const newUser = yield prisma.user.create({
        data: {
            email: email,
            password: hashPassword,
            role: role || "USER",
        },
    });
    // sendResponse
    (0, sendResponse_1.sendResponse)(201, true, "User created successfully", { user: newUser }, res);
}));
