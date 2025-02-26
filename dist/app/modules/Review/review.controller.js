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
exports.reviewGetByProductId = exports.createReview = void 0;
const client_1 = require("@prisma/client");
const catchAsync_1 = require("../../utills/catchAsync");
const sendResponse_1 = require("../../utills/sendResponse");
const prisma = new client_1.PrismaClient();
// ------------------- create review--------------------
exports.createReview = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, comment, rating, userId } = req.body;
    //  result
    const result = yield prisma.review.create({
        data: {
            userId,
            productId,
            comment,
            rating
        }
    });
    // Send response
    (0, sendResponse_1.sendResponse)(201, true, "Review created successfully", { result }, res);
}));
// get  review by id 
exports.reviewGetByProductId = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = prisma.review.findMany({
        where: { productId: id }
    });
    // Send response
    (0, sendResponse_1.sendResponse)(201, true, "Review retrive successfully", { result }, res);
}));
