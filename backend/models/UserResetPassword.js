const { Schema, model } = require('mongoose');

const resetPasswordSchema = new Schema(
    {
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
        },
    },
    {
        timestamps: true,
    }
);

// Add unique index on userId field
resetPasswordSchema.index({ userId: 1 }, { unique: true });

const ResetPassword = model('ResetPassword', resetPasswordSchema);

module.exports = ResetPassword;
