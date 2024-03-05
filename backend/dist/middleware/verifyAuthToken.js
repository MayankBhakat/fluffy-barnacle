"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyIsLoggedIn = (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        if (!token) {
            return res.status(403).send({
                message: "A TOKEN IS REQUIRED FOR AUTHENTICATION",
                success: false
            });
        }
        try {
            //We have to define the type secret otherwise it shows "Bhayanak error" and says type is unassignable
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
            //This is authentication request
            req.user = decoded;
            //We use next() in catch blog to make sure the middleware after this middleware will work properly
            next();
        }
        catch (err) {
            return res.status(401).send({
                message: "UNAUTHORIZED. INVALID TOKEN",
                success: true
            });
        }
    }
    catch (err) {
        next(err);
    }
};
exports.default = verifyIsLoggedIn;
