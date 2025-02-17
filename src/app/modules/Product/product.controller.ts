import { PrismaClient, Product } from "@prisma/client";
import { catchAsync } from "../../utills/catchAsync";
import { sendResponse } from "../../utills/sendResponse";
import { AppError } from "../../utills/error";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// -----------------------1. create Product --------------------------------

export const createProduct = catchAsync(async (req: Request, res: Response) => {
  // Ensure files exist
  if (!req.files || !("thumbnail" in req.files) || !("additionalImages" in req.files)) {
    throw new AppError(400, "Thumbnail and additional images are required.");
  }

  // Type assertion for `req.files`
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  // Extract Cloudinary image URLs
  const thumbnailUrl = files["thumbnail"][0].path;
  const additionalImagesUrls = files["additionalImages"].map((file) => file.path);

  // Extract and validate product details from request body
  const body = req.body as Record<string, any>;

  // Convert necessary fields to appropriate types
  const productData = {
    name: body.name,
    description: body.description,
    categoryId: body.categoryId,
    shopId: body.shopId,
    price: parseFloat(body.price),  // ✅ Convert to number
    stock: parseInt(body.stock, 10),  // ✅ Convert to integer
    weight: parseFloat(body.weight),  // ✅ Convert to number
    discount: parseFloat(body.discount),  // ✅ Convert to number
    tags: Array.isArray(body.tags) ? body.tags : JSON.parse(body.tags || "[]"),  // ✅ Convert JSON string to array
    productThumbnail: thumbnailUrl,
    productImages: additionalImagesUrls,
  };

  // Validate `shopId`
  const shop = await prisma.shop.findUnique({ where: { id: productData.shopId } });
  if (!shop) throw new AppError(404, "Shop not found");

  // Validate `categoryId`
  const category = await prisma.category.findUnique({ where: { id: productData.categoryId } });
  if (!category) throw new AppError(404, "Category not found");

  // Check if product already exists
  const existingProduct = await prisma.product.findUnique({ where: { name: productData.name } });
  if (existingProduct) throw new AppError(400, "Product already exists");

  // Create new product
  const newProduct = await prisma.product.create({ data: productData });

  // Send response
  sendResponse(201, true, "Product created successfully", { newProduct }, res);
});


// --------------------2. get all products --------------------------------

export const getAllProducts = catchAsync(
  async (req: Request, res: Response) => {
    // get all products but chek isDeleted is false
    const products = await prisma.product.findMany({
      where: { isDeleted: false },
    });
    // send response to user with products data
    sendResponse(200, true, "All products", { products }, res);
  }
);

// --------------------3. get product by id --------------------------------

export const getProductById = catchAsync(
  async (req: Request, res: Response) => {
    // get product id from request params
    const { id } = req.params;

    // find product
    const product = await prisma.product.findUnique({
      where: { id },
    });

    // check if product exists
    if (!product) {
      throw new AppError(404, "Product not found");
    }

    // send response to user with product data
    sendResponse(200, true, "Product", { product }, res);
  }
);

// --------------------4. update product by id --------------------------------

export const updateProductById = catchAsync(
  async (req: Request, res: Response) => {
    // get product id from request params
    const { id } = req.params;

    // find product
    const product = await prisma.product.findUnique({
      where: { id },
    });

    // check if product exists
    if (!product) {
      throw new AppError(404, "Product not found");
    }

    // update product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: req.body,
    });

    // send response to user with updated product data
    sendResponse(
      200,
      true,
      "Product updated successfully",
      { product: updatedProduct },
      res
    );
  }
);
