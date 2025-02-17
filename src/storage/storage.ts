import { Request } from "express";
import multer, { StorageEngine } from "multer";
import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME ,
  api_key: process.env.CLOUDINARY_KEY ,
  api_secret: process.env.CLOUDINARY_SECRET ,
});

// Cloudinary Storage Configuration
const storage: StorageEngine = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: async (req: Request, file: Express.Multer.File) => ({
    folder: "products", // Cloudinary folder
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  }),
});

// Initialize Multer
const upload = multer({ storage });

// ✅ Correct Export
export { upload }; // OR export default upload;
