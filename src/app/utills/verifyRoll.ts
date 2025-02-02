import { Request, Response, NextFunction } from "express";
import { AppError } from "../utills/error";
import jwt from "jsonwebtoken";
import config from "../config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const verifyRoll = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new AppError(401, "Authentication required");
    }

    try {
      const decoded = jwt.verify(token, config.JWT_SECRET.JWT_ACCESS_SECRET as jwt.Secret) as any;

      // find user in the database
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        throw new AppError(404, "Resource not found");
      }

      if (!roles.includes(user.role)) {
        throw new AppError(403, "Access denied");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};