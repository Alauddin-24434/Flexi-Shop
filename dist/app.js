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
const auth_route_1 = require("./app/modules/Auth/auth.route");
const shop_route_1 = require("./app/modules/Shop/shop.route");
const product_route_1 = require("./app/modules/Product/product.route");
const category_route_1 = require("./app/modules/Category/category.route");
const client_1 = require("@prisma/client");
const globalErrorHandeller_1 = require("./app/middleware/globalErrorHandeller");
dotenv_1.default.config();
const app = (0, express_1.default)();
// middleware
app.use(express_1.default.json());
// CORS configuration
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000",],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));
app.options("*", (0, cors_1.default)()); // Allow preflight requests
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
// response testing
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Hello world",
    });
});
const prisma = new client_1.PrismaClient();
// Test Database Connection
app.get("/test", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.$connect();
        res.json({ message: "Connected to Railway PostgreSQL!" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Database connection failed! " });
    }
}));
// API routes
app.use("/api", auth_route_1.authRouter);
app.use("/api", shop_route_1.shopRouter);
app.use("/api", category_route_1.categoryRouter);
app.use("/api", product_route_1.productRouter);
// not found page
app.use("/", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Ops! api not found",
    });
});
// error handeller
app.use(globalErrorHandeller_1.globalErrorHandler);
exports.default = app;
