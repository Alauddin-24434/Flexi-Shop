"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = void 0;
const express_1 = require("express");
const product_controller_1 = require("./product.controller");
const storage_1 = require("../../../storage/storage");
const router = (0, express_1.Router)();
// create product route
router.post("/product", storage_1.upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "additionalImages", maxCount: 10 }, // Allow up to 10 images
]), product_controller_1.createProduct);
// get all products
router.get('/products', product_controller_1.getAllProducts);
// 
exports.productRouter = router;
