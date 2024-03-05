"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_user_by_id = exports.loginUser = exports.registerUser = void 0;
const UserModel_1 = __importDefault(require("../models/UserModel"));
const hashPassword_1 = require("../utils/hashPassword");
const generateAuthToken_1 = __importDefault(require("../utils/generateAuthToken"));
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).send({
                success: false,
                message: 'ALL INPUT FIELDS ARE REQUIRED',
                data: null,
            });
        }
        const userExists = await UserModel_1.default.findOne({ email });
        if (userExists) {
            return res.status(400).send({
                success: false,
                message: 'USER WITH THIS EMAIL ALREADY EXISTS',
                data: null,
            });
        }
        else {
            const hashedPassword = (0, hashPassword_1.hashPassword)(password);
            //.create in mongoose automatically calls for .save.
            const user = await UserModel_1.default.create({
                name,
                email: email.toLowerCase(),
                password: hashedPassword,
                verification: false,
            });
            return res.send({
                success: true,
                message: 'USER CREATED .VERIFICATION EMAIL SENT.',
                userCreated: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    verification: user.verification,
                },
            });
        }
    }
    catch (err) {
        console.error('Error in registerUser:', err);
        next(err);
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res, next) => {
    try {
        const { email, password, doNotLogOut } = req.body;
        if (!email || !password) {
            return res.status(400).send({
                message: 'ALL INPUT FIELDS ARE REQUIRED',
                data: null,
                success: false,
            });
        }
        const user = await UserModel_1.default.findOne({ email }).orFail();
        if (!user.verification) {
            return res.status(400).send({
                message: 'USER NOT VERIFIED.CHECK VERIFICATION MAIL SENT TO REGISTERED EMAIL',
                success: false,
                data: null,
            });
        }
        if (user && (0, hashPassword_1.comparePasswords)(password, user.password)) {
            //Rememeber when u do a mapping like this,it is always desirable to declare the type exclusively to prevent mistakes
            let cookieParams = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            };
            const token = (0, generateAuthToken_1.default)(user._id, user.name, user.email, user.role);
            return res.status(201)
                .send({
                success: true,
                message: "USER LOGGED IN",
                userLoggedIn: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                },
                data: token,
            });
        }
        else {
            return res.status(401).send({
                message: "PASSWORD IS INCORRECT",
                success: false,
                data: null
            });
        }
    }
    catch (err) {
        if (err.name === 'DocumentNotFoundError') {
            return res.status(401).send({
                message: 'USER NOT FOUND',
                success: false,
                data: null
            });
        }
        else {
            console.log(err, 'Error in Login');
            next(err);
        }
    }
};
exports.loginUser = loginUser;
const get_user_by_id = async (req, res, next) => {
    const { _id, email, name, verification } = req.body;
    try {
        const user = await UserModel_1.default.findOne({ email });
        if (user) {
            return res.status(200).send({
                success: true,
                message: "USER FETCHED SUCCESSFULLY",
                data: user
            });
        }
        else {
            return res.status(400).send({
                success: false,
                message: "USER NOT FETCHED",
                data: null
            });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.get_user_by_id = get_user_by_id;
