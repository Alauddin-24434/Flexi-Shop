
import { Router } from "express";
import { createUser } from "./auth.controller";

const router= Router()

// create user route 
router.post("/signup", createUser);

export const authRouter = router;