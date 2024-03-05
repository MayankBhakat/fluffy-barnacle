import { Schema, model, Document } from 'mongoose';

type UserDocument = Document & {
    userId: string;
    uniqueString: string;
    createdAt: Date;
    expiresAt: Date;
    OTP_code:string;
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
        },
        OTP_code:{
            type:String,  
            required: true, 
        }
    },
    {
        timestamps: true,
    }
);

// Add unique index on userId field
userSchema.index({ userId: 1 }, { unique: true });

const ResetPassword = model<UserDocument>('ResetPassword', userSchema);

export default ResetPassword;