import { v2 as cloudinary, UploadApiResponse, UploadApiOptions } from "cloudinary";
import dotenv from 'dotenv';
import multer, { Multer } from 'multer';

import { Request, Response, NextFunction } from "express";

dotenv.config();

const cloud_name: string = process.env.CLOUD_NAME || '';
const api_key: string = process.env.CLOUDINARY_API_KEY || '';
const api_secret: string = process.env.CLOUDINARY_API_SECRET || '';

const upload = multer({ dest: 'uploads/'});


const storage = multer.memoryStorage(); // Use memory storage for faster processing


cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret,
});

const opts: UploadApiOptions = {
  overwrite: true,
  invalidate: true,
  resource_type: "auto", // Set 'resource_type' to 'auto'
};

