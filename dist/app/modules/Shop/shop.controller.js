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
exports.updateShopById = exports.getShopById = exports.getAllShops = exports.createShop = void 0;
const catchAsync_1 = require("../../utills/catchAsync");
const client_1 = require("@prisma/client");
const error_1 = require("../../utills/error");
const sendResponse_1 = require("../../utills/sendResponse");
const prisma = new client_1.PrismaClient();
//    ---------------------1. create Shop --------------------------------
exports.createShop = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get name, address, phone and email from request body
    const body = req.body;
    // find shop
    const isShopExist = yield prisma.shop.findUnique({
        where: { name: body.name },
    });
    // check if shop already exists
    if (isShopExist) {
        throw new error_1.AppError(400, "Shop already exists");
    }
    // find seller
    const isExistSeleller = yield prisma.user.findUnique({
        where: { id: body.sellerId },
    });
    // check if shop already exists
    if (!isExistSeleller) {
        throw new error_1.AppError(400, "Seller id does not exist");
    }
    // Create new shop
    const newShop = yield prisma.shop.create({
        data: {
            name: body.name,
            sellerId: body.sellerId,
        },
    });
    // send response to user with shop data
    (0, sendResponse_1.sendResponse)(201, true, "Shop created successfully", { shop: newShop }, res);
}));
// --------------------2. get all shops --------------------------------
exports.getAllShops = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const shops = yield prisma.shop.findMany();
    // send response to user with shops data
    (0, sendResponse_1.sendResponse)(200, true, "All shops", { shops }, res);
}));
// --------------------3. get shop by id --------------------------------
exports.getShopById = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get shop id from request params
    const { id } = req.params;
    // find shop
    const shop = yield prisma.shop.findUnique({
        where: { id },
    });
    // check if shop exists
    if (!shop) {
        throw new error_1.AppError(404, "Shop not found");
    }
    // send response to user with shop data
    (0, sendResponse_1.sendResponse)(200, true, "Shop", { shop }, res);
}));
// --------------------4. update shop by id --------------------------------
exports.updateShopById = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get shop id from request params
    const { id } = req.params;
    // get name, address, phone and email from request body
    const body = req.body;
    // find shop
    const shop = yield prisma.shop.findUnique({
        where: { id },
    });
    // check if shop exists
    if (!shop) {
        throw new error_1.AppError(404, "Shop not found");
    }
    // update shop
    const updatedShop = yield prisma.shop.update({
        where: { id },
        data: {
            name: body.name,
            sellerId: body.sellerId,
        },
    });
    // send response to user with updated shop data
    (0, sendResponse_1.sendResponse)(200, true, "Shop updated successfully", { shop: updatedShop }, res);
}));
