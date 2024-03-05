import { Schema, model, Document } from 'mongoose';

type UserDocument = Document & {
    name: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    country?: string;
    zipCode?: string;
    city?: string;
    state?: string;
    password: string;
    role: string;
    verification: boolean;
    wishlist?: string[]; // Wishlist property of type string array
};

const userSchema = new Schema<UserDocument>(
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
            default:"User",
            enum: ["User","Admin"],

        },
        verification: {
            type: Boolean,
            default: false,
        },
        wishlist:{
            type: [String],
        },
    },
    {
        timestamps: true,
    }
);

const User = model<UserDocument>('User', userSchema);

export default User;
