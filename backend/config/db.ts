
import mongoose, { ConnectOptions } from "mongoose";

const connectDB = async (): Promise<void> => {
    try {
        const dbUri = process.env.MONGO_URI || "mongodb://localhost:27017/defaultdatabase";

        await mongoose.connect(dbUri, {} as ConnectOptions);

        console.log("MongoDB connection SUCCESS");
    } catch (error) {
        console.error("MongoDB connection FAIL:", error);
        process.exit(1);
    }
};

export default connectDB;
