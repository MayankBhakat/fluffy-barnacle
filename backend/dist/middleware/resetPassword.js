"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.set_new_password = exports.verify_reset_password_mail = exports.resendresetPasswordEmail = exports.resetPasswordEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const UserResetPassword_1 = __importDefault(require("../models/UserResetPassword"));
const mongodb_1 = require("mongodb");
const UserModel_1 = __importDefault(require("../models/UserModel"));
const hashPassword_1 = require("../utils/hashPassword");
const dotenv_1 = __importDefault(require("dotenv"));
//U dont write dotenv.config() and it showsVerify_Email fails Error: Missing credentials for "PLAIN"
// [1]     at SMTPConnection._formatError 
dotenv_1.default.config();
//We need the version 4 submodule of uuid in our app
const uuid_1 = require("uuid");
let transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    },
});
const resetPasswordEmail = async (req, res, next) => {
    try {
        const { email, randomCode } = req.body;
        const user = await UserModel_1.default.findOne({ email });
        if (!user) {
            return res.status(400).send({
                success: false,
                message: "USER NOT FOUND"
            });
        }
        const userIdString = (user._id).toString();
        const existingResetPassword = await UserResetPassword_1.default.findOne({ userId: userIdString });
        if (existingResetPassword) {
            return res.status(400).send({
                success: false,
                message: "PASSWORD RESET MAIL HAS ALREADY BEEN SENT"
            });
        }
        const uniqueString = (0, uuid_1.v4)() + userIdString;
        const hashedUniqueString = (0, hashPassword_1.hashPassword)(uniqueString);
        const newResetPassword = await UserResetPassword_1.default.create({
            userId: userIdString,
            uniqueString: hashedUniqueString,
            createdAt: Date.now(),
            expiresAt: Date.now() + 21600000,
            OTP_code: randomCode,
        });
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Reset your password",
            html: `<p>Your OTP is ${randomCode}. You have 120 sec to enter the OTP</p>`,
        };
        try {
            await transporter.sendMail(mailOptions);
            console.log('Email sent successfully');
            return res.status(201).json({
                success: true,
                message: 'PASSWORDRESET MAIL CREATED',
                statues: 'PENDING',
                userId: userIdString,
                uniqueString: uniqueString,
            });
        }
        catch (emailError) {
            console.error('Error sending email:', emailError);
            return res.status(400).json({
                success: false,
                message: "ERROR SENDING EMAIL"
            });
        }
    }
    catch (err) {
        console.error('Error in reset password function:', err);
        next(err);
    }
};
exports.resetPasswordEmail = resetPasswordEmail;
const resendresetPasswordEmail = async (req, res, next) => {
    try {
        const { email, randomCode } = req.body;
        const user = await UserModel_1.default.findOne({ email });
        if (!user) {
            return res.status(400).send({
                success: false,
                message: "USER NOT FOUND"
            });
        }
        const userIdString = (user._id).toString();
        const existingResetPassword = await UserResetPassword_1.default.findOne({ userId: userIdString });
        if (existingResetPassword) {
            await UserResetPassword_1.default.deleteOne({ userId: userIdString });
        }
        const uniqueString = (0, uuid_1.v4)() + userIdString;
        const hashedUniqueString = (0, hashPassword_1.hashPassword)(uniqueString);
        const newResetPassword = await UserResetPassword_1.default.create({
            userId: userIdString,
            uniqueString: hashedUniqueString,
            createdAt: Date.now(),
            expiresAt: Date.now() + 21600000,
            OTP_code: randomCode,
        });
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Reset your password",
            html: `<p>Your OTP is ${randomCode}. You have 120 sec to enter the OTP</p>`,
        };
        try {
            await transporter.sendMail(mailOptions);
            console.log('Email sent successfully');
            return res.status(201).json({
                success: true,
                message: 'PASSWORDRESET MAIL CREATED',
                statues: 'PENDING',
                userId: userIdString,
                uniqueString: uniqueString,
            });
        }
        catch (emailError) {
            console.error('Error sending email:', emailError);
            return res.status(400).send({
                message: "ERROR SENDING EMAIL",
                success: false
            });
        }
    }
    catch (err) {
        console.error('Error in reset password function:', err);
        next(err);
    }
};
exports.resendresetPasswordEmail = resendresetPasswordEmail;
const verify_reset_password_mail = async (req, res, next) => {
    try {
        const { userId, uniqueString, OTP, time } = req.params;
        const newResetPasswordExists = await UserResetPassword_1.default.findOne({ userId });
        if (newResetPasswordExists) {
            const OTP_code = newResetPasswordExists.OTP_code;
            const time2 = Number(time);
            if (time2 <= 3) {
                return res.status(400).send({
                    success: false,
                    message: "USER TIMEOUT"
                });
            }
            if (OTP_code !== (OTP)) {
                return res.status(400).send({
                    success: false,
                    message: "OTP IS INCORRECT"
                });
            }
            //We convert the string into time object
            if (new Date(newResetPasswordExists.expiresAt).getTime() < Date.now()) {
                try {
                    const delete_reset_password_object = await UserResetPassword_1.default.deleteOne({ userId });
                    if (delete_reset_password_object) {
                        return res.status(400).send({
                            success: false,
                            message: 'RESET PASSWORD MAIL DELETED DUE TO EXPIRY.'
                        });
                    }
                }
                catch (err) {
                    return res.status(400).send({
                        success: false,
                        message: 'ERROR IN REMOVING EXPIRED VERIFICATION MAIL FROM DATABASE',
                    });
                }
            }
            else {
                const match_hashing = (0, hashPassword_1.comparePasswords)(uniqueString, newResetPasswordExists.uniqueString);
                if (match_hashing) {
                    res.status(201).send({
                        success: false,
                        message: 'YOU CAN SET NEW PASSWORD'
                    });
                }
                else {
                    res.status(400).send({
                        sucess: false,
                        message: 'THERE IS DISCREPENCY IN MATCHING THE STRINGS FOR EMAIL VERIFICATION'
                    });
                }
            }
        }
        else {
            return res.status(401).send({
                success: false,
                message: 'RESET PASSWOD DOESNOT EXIST'
            });
        }
    }
    catch (err) {
        console.error('Error during user verification ', err);
        next(err);
    }
};
exports.verify_reset_password_mail = verify_reset_password_mail;
const set_new_password = async (req, res, next) => {
    try {
        const { userId, uniqueString } = req.params;
        //The destructring of request body names should be same as whatever send in request.U cant name verifypassword as validate password
        const { password, verifypassword } = req.body;
        console.log(password, verifypassword);
        const newResetPasswordExists = await UserResetPassword_1.default.findOne({ userId });
        const objectId = new mongodb_1.ObjectId(userId);
        if (newResetPasswordExists) {
            //We convert the string into time object
            if (new Date(newResetPasswordExists.expiresAt).getTime() < Date.now()) {
                try {
                    const delete_reset_password_object = await UserResetPassword_1.default.deleteOne({ userId });
                    if (delete_reset_password_object) {
                        return res.status(400).send({
                            success: false,
                            message: 'RESET PASSWORD MAIL DELETED DUE TO EXPIRY.'
                        });
                    }
                }
                catch (err) {
                    return res.status(400).send({
                        success: false,
                        message: 'ERROR IN REMOVING EXPIRED VERIFICATION MAIL FROM DATABASE',
                    });
                }
            }
            else {
                const match_hashing = (0, hashPassword_1.comparePasswords)(uniqueString, newResetPasswordExists.uniqueString);
                if (match_hashing) {
                    try {
                        const user_exists = await UserModel_1.default.findOne({ _id: objectId });
                        if (password === verifypassword) {
                            const new_hash_password = (0, hashPassword_1.hashPassword)(password);
                            await UserModel_1.default.updateOne({ _id: objectId }, { password: new_hash_password });
                            await UserResetPassword_1.default.deleteOne({ userId });
                            return res.status(201).send({
                                success: true,
                                message: 'PASSWORD RESET SUCCESSFULLY'
                            });
                        }
                        else {
                            return res.status(401).send({
                                success: true,
                                message: 'BOTH PASSWORDS DO NOT MATCH'
                            });
                        }
                    }
                    catch (err) {
                        return res.status(400).send({
                            sucess: true,
                            message: 'USER NOT FOUND'
                        });
                    }
                }
                else {
                    res.status(400).send({
                        sucess: false,
                        message: 'THERE IS DISCREPENCY IN MATCHING THE STRINGS FOR EMAIL VERIFICATION'
                    });
                }
            }
        }
        else {
            return res.status(401).send({
                success: false,
                message: 'RESET PASSWOD DOESNOT EXIST'
            });
        }
    }
    catch (err) {
        console.error('Error during matching password ', err);
        next(err);
    }
};
exports.set_new_password = set_new_password;
