import { Router } from "express";

import { verifyRoll } from "../../utills/verifyRoll";
import { createCategory } from "./category.controller";


const router=Router();

// create shop route
router.post("/category", verifyRoll(['SELLER']), createCategory);


// export category router

export const categoryRouter=router;