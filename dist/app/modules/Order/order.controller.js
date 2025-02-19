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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.updateOrderStatus = exports.getOrderById = exports.getAllOrders = exports.createOrder = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// ✅ Create a new order
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, items } = req.body;
        // Calculate total amount
        const totalAmount = items.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);
        // Create order with items
        const order = yield prisma.order.create({
            data: {
                userId,
                totalAmount,
                items: {
                    create: items.map((item) => ({
                        productId: item.productId,
                        shopId: item.shopId,
                        quantity: item.quantity,
                    })),
                },
            },
            include: { items: true },
        });
        res.status(201).json({ success: true, order });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to create order" });
    }
});
exports.createOrder = createOrder;
// ✅ Get all orders
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield prisma.order.findMany({
            include: { items: true },
        });
        res.status(200).json({ success: true, orders });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to get orders" });
    }
});
exports.getAllOrders = getAllOrders;
// ✅ Get order by ID
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const order = yield prisma.order.findUnique({
            where: { id },
            include: { items: true },
        });
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        res.status(200).json({ success: true, order });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to get order" });
    }
});
exports.getOrderById = getOrderById;
// ✅ Update order status
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedOrder = yield prisma.order.update({
            where: { id },
            data: { status },
        });
        res.status(200).json({ success: true, updatedOrder });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to update order status" });
    }
});
exports.updateOrderStatus = updateOrderStatus;
// ✅ Delete an order
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.orderItem.deleteMany({
            where: { orderId: id },
        });
        yield prisma.order.delete({
            where: { id },
        });
        res.status(200).json({ success: true, message: "Order deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to delete order" });
    }
});
exports.deleteOrder = deleteOrder;
