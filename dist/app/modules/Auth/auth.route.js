"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const verifyRoll_1 = require("../../utills/verifyRoll");
const router = (0, express_1.Router)();
// signup route
router.post("/signup", auth_controller_1.createUser);
// login route
router.post("/login", auth_controller_1.loginUser);
// refresh token route
router.post("/refresh-token", auth_controller_1.refreshToken);
// find all users route role based
router.get("/users", (0, verifyRoll_1.verifyRoll)(["SUPER_ADMIN", "ADMIN"]), auth_controller_1.getAllUsers);
// find user by id route
router.get("/user/:id", auth_controller_1.getUserById);
// update user by id route
router.put("/user-update/:id", auth_controller_1.updateUserById);
// update user role only accesble  by super admin
router.put("/user-role-update/:id", (0, verifyRoll_1.verifyRoll)(["SUPER_ADMIN"]), auth_controller_1.updateUserById);
// update user Existing role to new role to SELLER  accessble by super admin and admin
router.put("/user-role-update-to-seller/:id", (0, verifyRoll_1.verifyRoll)(["SUPER_ADMIN", "ADMIN"]), auth_controller_1.updateUserById);
exports.authRouter = router;
