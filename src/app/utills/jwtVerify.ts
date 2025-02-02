import jwt from "jsonwebtoken";
import config from "../config";
import { AppError } from "./error";

// jwt verify

export const jwtVerify = (refreshToken: string) => {
  try {
    const decoded = jwt.verify(
      refreshToken,
      config.JWT_SECRET.JWT_REFRESH_SECRET as jwt.Secret
    );
    return decoded;
  } catch (error) {
    throw new AppError(401, "Invalid token");
  }
};
