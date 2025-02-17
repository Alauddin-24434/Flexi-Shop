import { Router } from "express";
import { createShop, getAllShops, getShopById, updateShopById } from "./shop.controller";
import { verifyRoll } from "../../utills/verifyRoll";


const router=Router();

// create shop route
router.post("/shop",  createShop);

// get all shops route
router.get("/shops",getAllShops);

// get shop by id route
router.get("/shop/:id",getShopById);

// update shop by id route
router.put("/shop-update/:id", updateShopById);

// export shop router

export const shopRouter=router;