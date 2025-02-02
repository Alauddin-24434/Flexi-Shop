import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  loginUser,
  refreshToken,
  updateUserById,
} from "./auth.controller";
import { verifyRoll } from "../../utills/verifyRoll";

const router = Router();

// signup route
router.post("/signup", createUser);

// login route
router.post("/login", loginUser);

// refresh token route
router.post("/refresh-token", refreshToken);

// find all users route role based
router.get("/users", verifyRoll(["SUPER_ADMIN","ADMIN"]) ,getAllUsers);

// find user by id route
router.get("/user/:id", getUserById);

// update user by id route
router.put("/user-update/:id", updateUserById );

// update user role only accesble  by super admin
router.put("/user-role-update/:id", verifyRoll(["SUPER_ADMIN"]) ,updateUserById );

// update user Existing role to new role to SELLER  accessble by super admin and admin
router.put("/user-role-update-to-seller/:id", verifyRoll(["SUPER_ADMIN","ADMIN"]) ,updateUserById );


export const authRouter = router;
