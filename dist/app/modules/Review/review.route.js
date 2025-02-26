"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRouter = void 0;
const express_1 = require("express");
const review_controller_1 = require("./review.controller");
const router = (0, express_1.Router)();
// create review
router.post("/review", review_controller_1.createReview);
//  get review by productId
router.get('/review/:id', review_controller_1.reviewGetByProductId);
// export review router
exports.ReviewRouter = router;
