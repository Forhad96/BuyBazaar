import multer from "multer";
import path from "path";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import fs from "fs/promises"; // Use promises-based fs for modern asynchronous patterns
import { IFile } from "../app/interfaces/file";
import { config } from "../app/config";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: config.cloudinaryConfig.cloud_name,
  api_key: config.cloudinaryConfig.api_key,
  api_secret: config.cloudinaryConfig.api_secret,
});

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve("uploads")); // Use resolve for consistent path handling
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Add timestamp for unique file naming
  },
});

const upload = multer({ storage });

// Upload to Cloudinary
const uploadToCloudinary = async (file: IFile): Promise<UploadApiResponse> => {
  try {
    const result = await cloudinary.uploader.upload(file.path);
    await fs.unlink(file.path); // Asynchronously remove the file after upload
    return result;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    throw new Error("File upload failed. Please try again.");
  }
};

// Export File Uploader Module
export const fileUploader = { upload, uploadToCloudinary };
