import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cron from "node-cron";
import { PrismaClient } from "@prisma/client";

import { authRouter } from "./app/modules/Auth/auth.route";
import { shopRouter } from "./app/modules/Shop/shop.route";
import { productRouter } from "./app/modules/Product/product.route";
import { categoryRouter } from "./app/modules/Category/category.route";
import { globalErrorHandler } from "./app/middleware/globalErrorHandeller";
import { ReviewRouter } from "./app/modules/Review/review.route";

dotenv.config();

const app: Application = express();
const prisma = new PrismaClient();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// ✅ Secure & Dynamic CORS Configuration
const allowedOrigins = [
  "http://localhost:3000",
  "https://your-production-domain.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.options("*", cors()); // Allow preflight requests

// ✅ Response Testing Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Hello world",
  });
});

// ✅ Test Database Connection
app.get("/test", async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ message: "Connected to Railway PostgreSQL!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database connection failed!" });
  }
});

// ✅ Remove Expired Flash Sales (Optimized & Error Handled)
const removeExpiredFlashSales = async () => {
  try {
    const expiredSales = await prisma.flashSale.findMany({
      where: { endDate: { lt: new Date() } },
    });

    for (const sale of expiredSales) {
      // Reset Discount of the Expired Flash Sale Product
      await prisma.product.update({
        where: { id: sale.productId },
        data: { discount: 0 },
      });

      // Delete Expired Flash Sale
      await prisma.flashSale.delete({ where: { id: sale.id } });
    }

    console.log("✅ Expired Flash Sales removed successfully!");
  } catch (error) {
    console.error("❌ Error removing expired flash sales:", error);
  }
};

// ✅ Cron Job to Remove Expired Flash Sales at Midnight
cron.schedule("0 0 * * *", removeExpiredFlashSales);

// ✅ API Routes
app.use("/api", authRouter);
app.use("/api", shopRouter);
app.use("/api", categoryRouter);
app.use("/api", productRouter);
app.use("/api", ReviewRouter);

// ✅ Handle 404 Not Found
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "🚨 API Not Found!",
  });
});

// ✅ Global Error Handler Middleware
app.use(globalErrorHandler);

// ✅ Graceful Shutdown: Disconnect Prisma on Exit
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Prisma disconnected gracefully.");
  process.exit(0);
});

export default app;
