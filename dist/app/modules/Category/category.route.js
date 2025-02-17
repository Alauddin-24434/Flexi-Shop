"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRouter = void 0;
const express_1 = require("express");
const verifyRoll_1 = require("../../utills/verifyRoll");
const category_controller_1 = require("./category.controller");
const router = (0, express_1.Router)();
// create shop route
router.post("/category", (0, verifyRoll_1.verifyRoll)(['SELLER']), category_controller_1.createCategory);
// export category router
exports.categoryRouter = router;
