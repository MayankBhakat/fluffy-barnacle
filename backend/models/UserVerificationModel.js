const { Schema, model } = require('mongoose');

const userVerificationSchema = new Schema(
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
    },
    {
        timestamps: true,
    }
);

const UserVerification = model('UserVerification', userVerificationSchema);

module.exports = UserVerification;
