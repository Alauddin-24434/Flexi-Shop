"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const node_cron_1 = __importDefault(require("node-cron"));
const client_1 = require("@prisma/client");
const auth_route_1 = require("./app/modules/Auth/auth.route");
const shop_route_1 = require("./app/modules/Shop/shop.route");
const product_route_1 = require("./app/modules/Product/product.route");
const category_route_1 = require("./app/modules/Category/category.route");
const globalErrorHandeller_1 = require("./app/middleware/globalErrorHandeller");
const review_route_1 = require("./app/modules/Review/review.route");
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
// Middleware
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
// ✅ Secure & Dynamic CORS Configuration
const allowedOrigins = [
    "http://localhost:3000",
    "https://your-production-domain.com",
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));
app.options("*", (0, cors_1.default)()); // Allow preflight requests
// ✅ Response Testing Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Hello world",
    });
});
// ✅ Test Database Connection
app.get("/test", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.$connect();
        res.json({ message: "Connected to Railway PostgreSQL!" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Database connection failed!" });
    }
}));
// ✅ Remove Expired Flash Sales (Optimized & Error Handled)
const removeExpiredFlashSales = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expiredSales = yield prisma.flashSale.findMany({
            where: { endDate: { lt: new Date() } },
        });
        for (const sale of expiredSales) {
            // Reset Discount of the Expired Flash Sale Product
            yield prisma.product.update({
                where: { id: sale.productId },
                data: { discount: 0 },
            });
            // Delete Expired Flash Sale
            yield prisma.flashSale.delete({ where: { id: sale.id } });
        }
        console.log("✅ Expired Flash Sales removed successfully!");
    }
    catch (error) {
        console.error("❌ Error removing expired flash sales:", error);
    }
});
// ✅ Cron Job to Remove Expired Flash Sales at Midnight
node_cron_1.default.schedule("0 0 * * *", removeExpiredFlashSales);
// ✅ API Routes
app.use("/api", auth_route_1.authRouter);
app.use("/api", shop_route_1.shopRouter);
app.use("/api", category_route_1.categoryRouter);
app.use("/api", product_route_1.productRouter);
app.use("/api", review_route_1.ReviewRouter);
// ✅ Handle 404 Not Found
app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "🚨 API Not Found!",
    });
});
// ✅ Global Error Handler Middleware
app.use(globalErrorHandeller_1.globalErrorHandler);
// ✅ Graceful Shutdown: Disconnect Prisma on Exit
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
    console.log("Prisma disconnected gracefully.");
    process.exit(0);
}));
exports.default = app;
