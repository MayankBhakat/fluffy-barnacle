"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const dbUri = process.env.MONGO_URI || "mongodb://localhost:27017/defaultdatabase";
        await mongoose_1.default.connect(dbUri, {});
        console.log("MongoDB connection SUCCESS");
    }
    catch (error) {
        console.error("MongoDB connection FAIL:", error);
        process.exit(1);
    }
};
exports.default = connectDB;
