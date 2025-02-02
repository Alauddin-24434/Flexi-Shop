import jwt from "jsonwebtoken";
import config from "../config";
import { Response } from "express";


interface JWTPayload {
  id: string;
  email: string;
  role: string;
  
}


// set tokens and cookies for user

export const setTokensAndCookies = (res: Response, payload: JWTPayload) => {
  // generate tokens for user passing id, email and role
  const accessToken = jwt.sign(
    { id: payload.id, email: payload.email, role: payload.role },
    config.JWT_SECRET.JWT_ACCESS_SECRET as jwt.Secret,
    {
      expiresIn: "1h", // 1 hour
    }
  );

  const refreshToken = jwt.sign(
    { id: payload.id, email: payload.email, role: payload.role },
    config.JWT_SECRET.JWT_REFRESH_SECRET as jwt.Secret,
    {
      expiresIn: "7d", // 7 days
    }
  );

  // Set cookies accessToken and refreshToken
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 1 * 60 * 60 * 1000, // 1 hour
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return { accessToken, refreshToken };
};
