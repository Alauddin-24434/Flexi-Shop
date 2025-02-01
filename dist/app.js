"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const globalErrorHandeller_1 = require("./app/utills/globalErrorHandeller");
dotenv_1.default.config();
const app = (0, express_1.default)();
// middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
// response testing
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Hello world",
    });
});
//  not found page
app.use('/', (req, res) => {
    res.status(404).json({
        success: false,
        message: "Ops! api not found",
    });
});
// error handeller
app.use(globalErrorHandeller_1.globalErrorHandelelr);
exports.default = app;
