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
exports.updateUserById = exports.getAllUsers = exports.getUserById = exports.refreshToken = exports.loginUser = exports.createUser = void 0;
const sendResponse_1 = require("../../utills/sendResponse");
const catchAsync_1 = require("../../utills/catchAsync");
const client_1 = require("@prisma/client");
const error_1 = require("../../utills/error");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const setTokensAndCookies_1 = require("../../utills/setTokensAndCookies");
const jwtVerify_1 = require("../../utills/jwtVerify");
const prisma = new client_1.PrismaClient();
//  --------------------1. create User --------------------------------
exports.createUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get email, password and role from request body
    const { email, password } = req.body;
    // find user
    const isUserExist = yield prisma.user.findUnique({
        where: { email },
    });
    // check if user already exists
    if (isUserExist) {
        throw new error_1.AppError(400, "User already exists");
    }
    // plan password convert to hash
    const hashPassword = yield bcryptjs_1.default.hash(password, 10);
    // Create new user
    const newUser = yield prisma.user.create({
        data: {
            email,
            password: hashPassword,
        },
    });
    // Set tokens and cookies
    (0, setTokensAndCookies_1.setTokensAndCookies)(res, {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
    });
    // send response to user with user data
    (0, sendResponse_1.sendResponse)(201, true, "User created successfully", { user: newUser }, res);
}));
// --------------------2. login User --------------------------------
exports.loginUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get email and password from request body
    const { email, password } = req.body;
    // find user
    const user = yield prisma.user.findUnique({
        where: { email },
    });
    // check if user exists
    if (!user) {
        throw new error_1.AppError(404, "User not found");
    }
    // check if password is correct
    const isPasswordCorrect = yield bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordCorrect) {
        throw new error_1.AppError(400, "Invalid email or password");
    }
    // Set tokens and cookies
    const token = (0, setTokensAndCookies_1.setTokensAndCookies)(res, {
        id: user.id,
        email: user.email,
        role: user.role,
    });
    const { accessToken } = token;
    // send response to user with user data
    (0, sendResponse_1.sendResponse)(200, true, "Login successful", { user, accessToken }, res);
}));
// --------------------3. refresh token --------------------------------
exports.refreshToken = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    console.log(refreshToken);
    if (!refreshToken) {
        throw new error_1.AppError(400, "Refresh token is required");
    }
    // verify refresh token
    const decoded = (0, jwtVerify_1.jwtVerify)(refreshToken);
    // find user
    const user = yield prisma.user.findUnique({
        where: { id: decoded.id },
    });
    if (!user) {
        throw new error_1.AppError(404, "User not found");
    }
    // Set tokens and cookies
    (0, setTokensAndCookies_1.setTokensAndCookies)(res, user);
    // send response to user with new access token
    (0, sendResponse_1.sendResponse)(200, true, "Token refreshed successfully", null, res);
}));
// ---------------------4. find user by id ----------------------------
exports.getUserById = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get user id from request params
    const { id } = req.params;
    // find user
    const user = yield prisma.user.findUnique({
        where: { id },
    });
    // check if user exists
    if (!user) {
        throw new error_1.AppError(404, "User not found");
    }
    // send response to user with user data
    (0, sendResponse_1.sendResponse)(200, true, "User found", { user }, res);
}));
// ---------------------5. find all users but not give roll admin or super admin ----------------------------
exports.getAllUsers = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma.user.findMany({
        where: {
            NOT: {
                role: {
                    in: ["ADMIN", "SUPER_ADMIN"],
                },
            },
        },
    });
    // send response to user with users data
    (0, sendResponse_1.sendResponse)(200, true, "Users retrive sucessfully", { users }, res);
}));
// ---------------------6. update user by id ----------------------------
exports.updateUserById = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get user id from request params
    const { id } = req.params;
    // find user
    const user = yield prisma.user.findUnique({
        where: { id },
    });
    // check if user exists
    if (!user) {
        throw new error_1.AppError(404, "User not found");
    }
    // update user
    const updatedUser = yield prisma.user.update({
        where: { id },
        data: req.body,
    });
    // send response to user with updated user data
    (0, sendResponse_1.sendResponse)(200, true, "User updated successfully", { user: updatedUser }, res);
}));
