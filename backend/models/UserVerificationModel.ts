import { Schema, model, Document } from 'mongoose';

type UserDocument = Document & {
    userId: string;
    uniqueString: string;
    createdAt: Date;
    expiresAt: Date;
};

const userSchema = new Schema<UserDocument>(
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
        createdAt:{
            type:Date,
            required: true,
        },
        expiresAt:{
            type:Date,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const UserVerification = model<UserDocument>('UserVerification', userSchema);

export default UserVerification;
