import { Request, Response } from "express";
import { sendResponse } from "../../utills/sendResponse";
import { catchAsync } from "../../utills/catchAsync";
import { PrismaClient } from "@prisma/client";
import { AppError } from "../../utills/error";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();







// createUser
export const createUser = catchAsync(async (req: Request, res: Response) => {
  const body = req.body;
  const { email, password, role } = body;

  // isUserExist
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  // user chek
  if (isUserExist) {
    throw new AppError(400, "User already exist");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  // crate new user

  const newUser = await prisma.user.create({
    data: {
      email: email,
      password: hashPassword,
      role: role || "USER",
    },
  });

  // sendResponse
  sendResponse(201, true, "User created successfully", { user: newUser }, res);
});
