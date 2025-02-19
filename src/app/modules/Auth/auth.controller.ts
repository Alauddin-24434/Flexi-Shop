import { Request, Response } from "express";
import { sendResponse } from "../../utills/sendResponse";
import { catchAsync } from "../../utills/catchAsync";
import { PrismaClient } from "@prisma/client";
import { AppError } from "../../utills/error";
import bcrypt from "bcryptjs";

import { setTokensAndCookies } from "../../utills/setTokensAndCookies";
import { jwtVerify } from "../../utills/jwtVerify";

const prisma = new PrismaClient();


//  --------------------1. create User --------------------------------
export const createUser = catchAsync(async (req: Request, res: Response) => {
  // get email, password and role from request body
  const { email, password } = req.body;

  // find user
  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  // check if user already exists
  if (isUserExist) {
    throw new AppError(400, "User already exists");
  }

  // plan password convert to hash
  const hashPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashPassword,
    },
  });

  // Set tokens and cookies
  setTokensAndCookies(res, {
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
  });
  // send response to user with user data
  sendResponse(201, true, "User created successfully", { user: newUser }, res);
});


// --------------------2. login User --------------------------------

export const loginUser = catchAsync(async (req: Request, res: Response) => {
  // get email and password from request body
  const { email, password } = req.body;

  // find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // check if user exists
  if (!user) {
    throw new AppError(404, "User not found");
  }

  // check if password is correct
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new AppError(400, "Invalid email or password");
  }

  // Set tokens and cookies
  const token = setTokensAndCookies(res, {
    id: user.id,
    email: user.email,
    role: user.role,
  });
  const { accessToken } = token;
  // send response to user with user data
  sendResponse(200, true, "Login successful", { user, accessToken }, res);
});


// --------------------3. refresh token --------------------------------

export const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  console.log(refreshToken);

  if (!refreshToken) {
    throw new AppError(400, "Refresh token is required");
  }

  // verify refresh token
  const decoded = jwtVerify(refreshToken);

  // find user
  const user = await prisma.user.findUnique({
    where: { id: (decoded as any).id },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  // Set tokens and cookies
  setTokensAndCookies(res, user);

  // send response to user with new access token
  sendResponse(200, true, "Token refreshed successfully", null, res);
});


// ---------------------4. find user by id ----------------------------

export const getUserById = catchAsync(async (req: Request, res: Response) => {
  // get user id from request params
  const { id } = req.params;

  // find user
  const user = await prisma.user.findUnique({
    where: { id },
  });

  // check if user exists
  if (!user) {
    throw new AppError(404, "User not found");
  }

  // send response to user with user data
  sendResponse(200, true, "User found", { user }, res);
});

// ---------------------5. find all users but not give roll admin or super admin ----------------------------

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    where: {
      NOT: {
        role: {
          in: ["ADMIN", "SUPER_ADMIN"],
        },
      },
    },
  });

  // send response to user with users data
  sendResponse(200, true, "Users retrive sucessfully", { users }, res);
});

// ---------------------6. update user by id ----------------------------

export const updateUserById = catchAsync(
  async (req: Request, res: Response) => {
    // get user id from request params
    const { id } = req.params;

    // find user
    const user = await prisma.user.findUnique({
      where: { id },
    });

    // check if user exists
    if (!user) {
      throw new AppError(404, "User not found");
    }

    // update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: req.body,
    });

    // send response to user with updated user data
    sendResponse(
      200,
      true,
      "User updated successfully",
      { user: updatedUser },
      res
    );
  }
);
