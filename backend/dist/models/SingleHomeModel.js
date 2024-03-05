"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const singleHomeSchema = new mongoose_1.Schema({
    city: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    bathrooms: {
        type: Number,
        required: true,
    },
    bedrooms: {
        type: Number,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
    fees: {
        type: Number,
        required: true,
    },
    owner_id: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    image1: {
        type: String,
    },
    image2: {
        type: String,
    },
    image3: {
        type: String,
    },
    address: {
        type: String,
    }
}, {
    timestamps: true,
});
const SingleHome = (0, mongoose_1.model)('SingleHome', singleHomeSchema);
exports.default = SingleHome;
