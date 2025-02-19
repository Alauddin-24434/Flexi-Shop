import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Create a new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { userId, items } = req.body;

    // Calculate total amount
    const totalAmount = items.reduce((total: number, item: any) => {
      return total + item.price * item.quantity;
    }, 0);

    // Create order with items
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            shopId: item.shopId,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
};

// ✅ Get all orders
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
    });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to get orders" });
  }
};

// ✅ Get order by ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to get order" });
  }
};

// ✅ Update order status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
    });

    res.status(200).json({ success: true, updatedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update order status" });
  }
};

// ✅ Delete an order
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.orderItem.deleteMany({
      where: { orderId: id },
    });

    await prisma.order.delete({
      where: { id },
    });

    res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete order" });
  }
};
