import { Request, Response } from "express";
import { catchAsync } from "../../utills/catchAsync";
import { PrismaClient, Shop } from "@prisma/client";
import { AppError } from "../../utills/error";
import { sendResponse } from "../../utills/sendResponse";
const prisma = new PrismaClient();

//    ---------------------1. create Shop --------------------------------

export const createShop = catchAsync(async (req: Request, res: Response) => {
  // get name, address, phone and email from request body
  const body: Shop = req.body;

  // find shop
  const isShopExist = await prisma.shop.findUnique({
    where: { name: body.name },
  });

  // check if shop already exists
  if (isShopExist) {
    throw new AppError(400, "Shop already exists");
  }
  // find seller
  const isExistSeleller = await prisma.user.findUnique({
    where: { id: body.sellerId },
  });

  // check if shop already exists
  if (!isExistSeleller) {
    throw new AppError(400, "Seller id does not exist");
  }



  // Create new shop
  const newShop = await prisma.shop.create({
    data: {
      name: body.name,

      sellerId: body.sellerId,
    },
  });

  // send response to user with shop data
  sendResponse(201, true, "Shop created successfully", { shop: newShop }, res);
});

// --------------------2. get all shops --------------------------------

export const getAllShops = catchAsync(async (req: Request, res: Response) => {
  const shops = await prisma.shop.findMany();
  // send response to user with shops data
  sendResponse(200, true, "All shops", { shops }, res);
});

// --------------------3. get shop by id --------------------------------

export const getShopById = catchAsync(async (req: Request, res: Response) => {
  // get shop id from request params
  const { id } = req.params;

  // find shop
  const shop = await prisma.shop.findUnique({
    where: { id },
  });

  // check if shop exists
  if (!shop) {
    throw new AppError(404, "Shop not found");
  }

  // send response to user with shop data
  sendResponse(200, true, "Shop", { shop }, res);
});



// --------------------4. update shop by id --------------------------------

export const updateShopById = catchAsync(async (req: Request, res: Response) => {
  // get shop id from request params
  const { id } = req.params;

  // get name, address, phone and email from request body
  const body: Shop = req.body;

  // find shop
  const shop = await prisma.shop.findUnique({
    where: { id },
  });

  // check if shop exists
  if (!shop) {
    throw new AppError(404, "Shop not found");
  }

  // update shop
  const updatedShop = await prisma.shop.update({
    where: { id },
    data: {
      name: body.name,

      sellerId: body.sellerId,
    },
  });

  // send response to user with updated shop data
  sendResponse(200, true, "Shop updated successfully", { shop: updatedShop }, res);
});