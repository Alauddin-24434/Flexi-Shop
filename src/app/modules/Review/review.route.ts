import { Router } from "express";
import { createReview, getAllReview, reviewGetByProductId } from "./review.controller";

const router=Router();

// create review
router.post("/review",  createReview);

//  get review by productId
router.get('/review/:id', reviewGetByProductId)

//  get all review
router.get('/reviews', getAllReview)

// export review router

export const ReviewRouter=router;