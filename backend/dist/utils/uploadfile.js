"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
dotenv_1.default.config();
const cloud_name = process.env.CLOUD_NAME || '';
const api_key = process.env.CLOUDINARY_API_KEY || '';
const api_secret = process.env.CLOUDINARY_API_SECRET || '';
const upload = (0, multer_1.default)({ dest: 'uploads/' });
const storage = multer_1.default.memoryStorage(); // Use memory storage for faster processing
cloudinary_1.v2.config({
    cloud_name: cloud_name,
    api_key: api_key,
    api_secret: api_secret,
});
const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: "auto", // Set 'resource_type' to 'auto'
};
