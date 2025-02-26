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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCetegory = exports.createCategory = void 0;
const catchAsync_1 = require("../../utills/catchAsync");
const client_1 = require("@prisma/client");
const error_1 = require("../../utills/error");
const sendResponse_1 = require("../../utills/sendResponse");
const prisma = new client_1.PrismaClient();
// ----------------------------1. create category-------------------------
exports.createCategory = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    //   find category
    const isCategoryExist = yield prisma.category.findUnique({
        where: { name: body.name },
    });
    // isAlredyExist
    if (isCategoryExist) {
        throw new error_1.AppError(400, "Category name alredy exist");
    }
    // create new Category
    const newCategory = yield prisma.category.create({
        data: {
            name: body.name,
            subcategories: body.subcategories,
        },
    });
    (0, sendResponse_1.sendResponse)(200, true, "Category is created successfully", { category: newCategory }, res);
}));
// ------------------------- 2. get all getegory -------------------------------
exports.getAllCetegory = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.category.findMany();
    (0, sendResponse_1.sendResponse)(200, true, "Category is retrive successfully", { result }, res);
}));
