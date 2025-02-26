import { catchAsync } from "../../utills/catchAsync";
import { Category, PrismaClient } from "@prisma/client";
import { AppError } from "../../utills/error";
import { sendResponse } from "../../utills/sendResponse";
import { Request, Response } from "express";
const prisma = new PrismaClient();

// ----------------------------1. create category-------------------------

export const createCategory = catchAsync(
  async (req: Request, res: Response) => {
    const body: Category = req.body;

    //   find category

    const isCategoryExist = await prisma.category.findUnique({
      where: { name: body.name },
    });

    // isAlredyExist

    if (isCategoryExist) {
      throw new AppError(400, "Category name alredy exist");
    }

    // create new Category
    const newCategory = await prisma.category.create({
      data: {
        name: body.name,
        subcategories: body.subcategories,
      },
    });

    sendResponse(
      200,
      true,
      "Category is created successfully",
      { category: newCategory },
      res
    );
  }
);

// ------------------------- 2. get all getegory -------------------------------

export const getAllCetegory= catchAsync(async (req:Request,res:Response)=>{
  const result =await prisma.category.findMany();
  sendResponse(
    200,
    true,
    "Category is retrive successfully",
    { result },
    res
  );
})