"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    uniqueString: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    OTP_code: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});
// Add unique index on userId field
userSchema.index({ userId: 1 }, { unique: true });
const ResetPassword = (0, mongoose_1.model)('ResetPassword', userSchema);
exports.default = ResetPassword;
