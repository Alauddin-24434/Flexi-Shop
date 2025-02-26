import { PrismaClient, Review } from "@prisma/client";
import { catchAsync } from "../../utills/catchAsync";
import { Request, Response } from "express";
import { sendResponse } from "../../utills/sendResponse";
import exp from "constants";




const prisma = new PrismaClient();



// ------------------- create review--------------------

export const createReview = catchAsync(async(req:Request, res:Response)=>{


    const {productId,comment,rating,userId} : Review= req.body;
    //  result

    const result= await prisma.review.create({
     data: {
        userId,
        productId,
        comment,
        rating
     }
    })
// Send response
  sendResponse(201, true, "Review created successfully", {result}, res);
})


// -----------------------get  review by id -------------------------

export const reviewGetByProductId= catchAsync(async(req:Request, res:Response)=>{

    const id= req.params.id;

    const result=await prisma.review.findMany({
        where:{productId:id}
    })
    // Send response
  sendResponse(201, true, "Review retrive successfully", {result}, res);
})


//  --------------------------get all review ----------------------------------

export const getAllReview= catchAsync(async(req:Request, res:Response)=>{
    const result = await prisma.review.findMany();
      // Send response
  sendResponse(201, true, "Review retrive successfully", {result}, res);
})