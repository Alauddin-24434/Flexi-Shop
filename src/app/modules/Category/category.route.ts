import { Router } from "express";

import { verifyRoll } from "../../utills/verifyRoll";
import { createCategory, getAllCetegory, } from "./category.controller";


const router=Router();

// create category
router.post("/category", verifyRoll(['SELLER']), createCategory);
// get all category
router.get("/category", getAllCetegory);


// export category router

export const categoryRouter=router;