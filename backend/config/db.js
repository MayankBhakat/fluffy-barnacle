const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const dbUri = process.env.MONGO_URI || "mongodb://localhost:27017/defaultdatabase";

        await mongoose.connect(dbUri, {});

        console.log("MongoDB connection SUCCESS");
    } catch (error) {
        console.error("MongoDB connection FAIL:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
