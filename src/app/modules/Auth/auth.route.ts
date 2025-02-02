
import { Router } from "express";
import { createUser, loginUser, refreshToken } from "./auth.controller";

const router= Router()

// signup route
router.post("/signup", createUser);

// login route
router.post("/login", loginUser );

// refresh token route
router.post("/refresh-token", refreshToken );

export const authRouter = router;