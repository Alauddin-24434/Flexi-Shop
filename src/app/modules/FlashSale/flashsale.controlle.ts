import { FlashSale, PrismaClient } from "@prisma/client";
import { catchAsync } from "../../utills/catchAsync";
import { Request, Response } from "express";
import { sendResponse } from "../../utills/sendResponse";

const prisma = new PrismaClient();


// --------------------------- Create flase sale ---------------------

export const createFlashSale = catchAsync(async (req: Request, res: Response) => {
    const { productId, discount, startDate, endDate }: FlashSale = req.body;

    // 1️⃣ নতুন Flash Sale তৈরি করো
    const flashSale = await prisma.flashSale.create({
        data: { productId, discount, startDate, endDate },
    });

    // 2️⃣ Product-এর discount আপডেট করো
    await prisma.product.update({
        where: { id: productId },
        data: { discount: discount }, // Flash Sale discount set
    });

    sendResponse(201, true, "Flash Sale created successfully", { flashSale }, res);
});



// ------------------------ get all flash sale-----------------------

export const getAllFlashSale= catchAsync(async  (req:Request, res:Response)=>{

  
    // get all 
    const result= await prisma.flashSale.findMany({
        include:{product:true}
    })

    sendResponse(201, true, "FlahSale created successfully", {result}, res)

});
