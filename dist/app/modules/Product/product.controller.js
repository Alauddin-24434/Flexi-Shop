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
exports.updateProductById = exports.getProductById = exports.getAllProducts = exports.createProduct = void 0;
const client_1 = require("@prisma/client");
const catchAsync_1 = require("../../utills/catchAsync");
const sendResponse_1 = require("../../utills/sendResponse");
const error_1 = require("../../utills/error");
const prisma = new client_1.PrismaClient();
// -----------------------1. create Product --------------------------------
exports.createProduct = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure files exist
    if (!req.files || !("thumbnail" in req.files) || !("additionalImages" in req.files)) {
        throw new error_1.AppError(400, "Thumbnail and additional images are required.");
    }
    // Type assertion for `req.files`
    const files = req.files;
    // Extract Cloudinary image URLs
    const thumbnailUrl = files["thumbnail"][0].path;
    const additionalImagesUrls = files["additionalImages"].map((file) => file.path);
    // Extract and validate product details from request body
    const body = req.body;
    // Convert necessary fields to appropriate types
    const productData = {
        name: body.name,
        description: body.description,
        categoryId: body.categoryId,
        shopId: body.shopId,
        price: parseFloat(body.price), // ✅ Convert to number
        stock: parseInt(body.stock, 10), // ✅ Convert to integer
        weight: parseFloat(body.weight), // ✅ Convert to number
        discount: parseFloat(body.discount), // ✅ Convert to number
        tags: Array.isArray(body.tags) ? body.tags : JSON.parse(body.tags || "[]"), // ✅ Convert JSON string to array
        productThumbnail: thumbnailUrl,
        productImages: additionalImagesUrls,
    };
    // Validate `shopId`
    const shop = yield prisma.shop.findUnique({ where: { id: productData.shopId } });
    if (!shop)
        throw new error_1.AppError(404, "Shop not found");
    // Validate `categoryId`
    const category = yield prisma.category.findUnique({ where: { id: productData.categoryId } });
    if (!category)
        throw new error_1.AppError(404, "Category not found");
    // Check if product already exists
    const existingProduct = yield prisma.product.findUnique({ where: { name: productData.name } });
    if (existingProduct)
        throw new error_1.AppError(400, "Product already exists");
    // Create new product
    const newProduct = yield prisma.product.create({ data: productData });
    // Send response
    (0, sendResponse_1.sendResponse)(201, true, "Product created successfully", { newProduct }, res);
}));
// --------------------2. get all products --------------------------------
exports.getAllProducts = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get all products but chek isDeleted is false
    const products = yield prisma.product.findMany({
        where: { isDeleted: false },
    });
    // send response to user with products data
    (0, sendResponse_1.sendResponse)(200, true, "All products", { products }, res);
}));
// --------------------3. get product by id --------------------------------
exports.getProductById = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get product id from request params
    const { id } = req.params;
    // find product
    const product = yield prisma.product.findUnique({
        where: { id },
    });
    // check if product exists
    if (!product) {
        throw new error_1.AppError(404, "Product not found");
    }
    // send response to user with product data
    (0, sendResponse_1.sendResponse)(200, true, "Product", { product }, res);
}));
// --------------------4. update product by id --------------------------------
exports.updateProductById = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get product id from request params
    const { id } = req.params;
    // find product
    const product = yield prisma.product.findUnique({
        where: { id },
    });
    // check if product exists
    if (!product) {
        throw new error_1.AppError(404, "Product not found");
    }
    // update product
    const updatedProduct = yield prisma.product.update({
        where: { id },
        data: req.body,
    });
    // send response to user with updated product data
    (0, sendResponse_1.sendResponse)(200, true, "Product updated successfully", { product: updatedProduct }, res);
}));
