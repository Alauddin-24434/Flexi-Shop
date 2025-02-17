"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shopRouter = void 0;
const express_1 = require("express");
const shop_controller_1 = require("./shop.controller");
const router = (0, express_1.Router)();
// create shop route
router.post("/shop", shop_controller_1.createShop);
// get all shops route
router.get("/shops", shop_controller_1.getAllShops);
// get shop by id route
router.get("/shop/:id", shop_controller_1.getShopById);
// update shop by id route
router.put("/shop-update/:id", shop_controller_1.updateShopById);
// export shop router
exports.shopRouter = router;
