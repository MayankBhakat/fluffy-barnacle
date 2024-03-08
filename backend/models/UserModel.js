const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phoneNumber: {
            type: String,
        },
        address: {
            type: String,
        },
        country: {
            type: String,
        },
        zipCode: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: "User",
            enum: ["User", "Admin"],
        },
        verification: {
            type: Boolean,
            default: false,
        },
        wishlist: {
            type: [String],
        },
    },
    {
        timestamps: true,
    }
);

const User = model('User', userSchema);

module.exports = User;
