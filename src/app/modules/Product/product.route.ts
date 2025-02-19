import { NextFunction, Request, Response, Router } from "express";
import { createProduct, getAllProducts, getProductById, updateProductById } from "./product.controller";

import { zodValidationRequest } from "../../middleware/zodValidationRequest";
import { productValidation } from "./product.validatio";
import { verifyRoll } from "../../utills/verifyRoll";
import { upload } from "../../../storage/storage";

const router = Router();

// create product route
router.post(
  "/product",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "additionalImages", maxCount: 10 }, // Allow up to 10 images
  ]),
 
 
  createProduct
);
// get all products

router.get('/products', getAllProducts);

// get product byId
router.get('/product/:id', getProductById )
// update productBy id
router.put('/product-update/:id', updateProductById)

export const productRouter = router;
