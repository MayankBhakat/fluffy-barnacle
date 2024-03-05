"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const UserVerificationModel_1 = __importDefault(require("../models/UserVerificationModel"));
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
transporter.verify((err, success) => {
    if (err) {
        console.log("Verify_Email fails", err);
    }
    else {
        console.log("Verify_Email is ok", success);
    }
});
const sendVerificationEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        try {
            const user_present = await UserModel_1.default.findOne({ email });
            if (user_present) {
                const _id = user_present._id;
                //Convert id to string as it is stored in string format in db
                const userIdString = _id.toString(); // Convert ObjectId to string
                const currentUrl = "http://localhost:5050";
                //generate unique string
                const uniqueString = (0, uuid_1.v4)() + userIdString;
                const mailOptions = {
                    from: process.env.AUTH_EMAIL,
                    to: email,
                    subject: "Verify your Email",
                    html: `<p>Verify your email address to complete the signup and login into your account</p><p>This link <b>expires in 6 hrs</b></p>.<p>Press <a href=${currentUrl + "/api/users/verify/" + _id + "/" + uniqueString}>here</a> to proceed</p>`,
                };
                const hashedUniqueString = (0, hashPassword_1.hashPassword)(uniqueString);
                const newVerification = await UserVerificationModel_1.default.create({
                    userId: userIdString,
                    uniqueString: hashedUniqueString,
                    createdAt: Date.now(),
                    expiresAt: Date.now() + 21600000,
                });
                try {
                    await transporter.sendMail(mailOptions);
                    console.log('Email sent successfully');
                }
                catch (emailError) {
                    // Handle errors related to email sending
                    console.error('Error sending email:', emailError);
                    next(emailError); // Propagate the error to the Express error-handling middleware
                    return; // Stop execution here to prevent continuing to the response logic
                }
                return res
                    .status(201)
                    .send({
                    success: true,
                    message: 'NEW VERIFICATION MAIL CREATED',
                    statues: 'PENDING',
                });
            }
        }
        catch (err) {
            return res.status(400).send({
                message: 'USER WITH THIS ID NOT FOUND',
                success: false,
            });
        }
    }
    catch (err) {
        console.error('Error occured in sendverification mail function', err);
        next(err);
    }
};
exports.sendVerificationEmail = sendVerificationEmail;
const verifyUser = async (req, res, next) => {
    try {
        const { userId, uniqueString } = req.params;
        const newverificationExists = await UserVerificationModel_1.default.findOne({ userId });
        // console.log(newverificationExists);
        const objectId = new mongodb_1.ObjectId(userId);
        if (newverificationExists) {
            //We convert the string into time object
            if (new Date(newverificationExists.expiresAt).getTime() < Date.now()) {
                try {
                    await UserModel_1.default.deleteOne({ _id: objectId });
                    const check_verification = await UserVerificationModel_1.default.deleteOne({ userId });
                    if (check_verification) {
                        return res.status(400).send({
                            message: 'VERIFICATION MAIL DELETED DUE TO EXPIRY.NEED TO REGISTER AGAIN',
                            success: false,
                        });
                    }
                }
                catch (err) {
                    return res.status(400).send({
                        message: 'ERROR IN REMOVING EXPIRED VERIFICATION MAIL FROM DATABASE',
                        success: false,
                    });
                }
            }
            else {
                const match_hashing = (0, hashPassword_1.comparePasswords)(uniqueString, newverificationExists.uniqueString);
                if (match_hashing) {
                    try {
                        await UserVerificationModel_1.default.deleteOne({ userId });
                        await UserModel_1.default.updateOne({ _id: objectId }, { verification: true });
                        res.status(201).send({
                            message: 'USER VERIFIED SUCCESSFULLY.NOW YOU CAN GO TO LOGIN PAGE AND LOG IN',
                            success: true,
                        });
                    }
                    catch (err) {
                        console.log('Failure in updating user');
                        next(err);
                    }
                }
                else {
                    res.status(400).send({
                        message: 'THERE IS DISCREPENCY IN MATCHING THE STRINGS FOR EMAIL VERIFICATION',
                        success: false,
                    });
                }
            }
        }
        else {
            return res.status(401).send({
                message: 'USER VERIFICATION DOESNOT EXIST',
                success: false,
            });
        }
    }
    catch (err) {
        console.error('Error during user verification ', err);
        next(err);
    }
};
exports.verifyUser = verifyUser;
