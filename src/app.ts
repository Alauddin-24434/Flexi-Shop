import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { authRouter } from "./app/modules/Auth/auth.route";
import { shopRouter } from "./app/modules/Shop/shop.route";
import { productRouter } from "./app/modules/Product/product.route";
import { categoryRouter } from "./app/modules/Category/category.route";

import { PrismaClient } from "@prisma/client";
import { globalErrorHandler } from "./app/middleware/globalErrorHandeller";

dotenv.config();

const app: Application = express();

// middleware
app.use(express.json());
// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:3000", ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.options("*", cors()); // Allow preflight requests
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// response testing
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Hello world",
  });
});
const prisma = new PrismaClient();
// Test Database Connection
app.get("/test", async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ message: "Connected to Railway PostgreSQL!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database connection failed! " });
  }
});

// API routes
app.use("/api", authRouter);
app.use("/api", shopRouter);
app.use("/api", categoryRouter);
app.use("/api", productRouter);



// not found page
app.use("/", (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Ops! api not found",
  });
});

// error handeller
app.use(globalErrorHandler);

export default app;
