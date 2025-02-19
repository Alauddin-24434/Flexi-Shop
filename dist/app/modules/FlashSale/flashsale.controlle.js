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
exports.getAllFlashSale = exports.createFlashSale = void 0;
const client_1 = require("@prisma/client");
const catchAsync_1 = require("../../utills/catchAsync");
const sendResponse_1 = require("../../utills/sendResponse");
const prisma = new client_1.PrismaClient();
// --------------------------- Create flase sale ---------------------
exports.createFlashSale = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, discount, startDate, endDate } = req.body;
    // 1️⃣ নতুন Flash Sale তৈরি করো
    const flashSale = yield prisma.flashSale.create({
        data: { productId, discount, startDate, endDate },
    });
    // 2️⃣ Product-এর discount আপডেট করো
    yield prisma.product.update({
        where: { id: productId },
        data: { discount: discount }, // Flash Sale discount set
    });
    (0, sendResponse_1.sendResponse)(201, true, "Flash Sale created successfully", { flashSale }, res);
}));
// ------------------------ get all flash sale-----------------------
exports.getAllFlashSale = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get all 
    const result = yield prisma.flashSale.findMany({
        include: { product: true }
    });
    (0, sendResponse_1.sendResponse)(201, true, "FlahSale created successfully", { result }, res);
}));
