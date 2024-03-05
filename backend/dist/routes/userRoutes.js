"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const verifyEmail_1 = require("../middleware/verifyEmail");
const resetPassword_1 = require("../middleware/resetPassword");
const authMiddleware_1 = __importDefault(require("../utils/authMiddleware"));
const router = express_1.default.Router();
router.post('/register', (req, res, next) => {
    (0, userController_1.registerUser)(req, res, next);
});
router.post('/login', (req, res, next) => {
    (0, userController_1.loginUser)(req, res, next);
});
router.get('/verify/:userId/:uniqueString', (req, res, next) => {
    (0, verifyEmail_1.verifyUser)(req, res, next);
});
router.post('/verify', (req, res, next) => {
    (0, verifyEmail_1.sendVerificationEmail)(req, res, next);
});
router.post('/reset_Password_Mail', (req, res, next) => {
    (0, resetPassword_1.resetPasswordEmail)(req, res, next);
});
router.post('/resend_reset_Password_Mail', (req, res, next) => {
    (0, resetPassword_1.resendresetPasswordEmail)(req, res, next);
});
router.get('/reset_Password_Mail/:userId/:uniqueString/:OTP/:time', (req, res, next) => {
    (0, resetPassword_1.verify_reset_password_mail)(req, res, next);
});
router.post('/reset_password/:userId/:uniqueString', (req, res, next) => {
    (0, resetPassword_1.set_new_password)(req, res, next);
});
router.post('/get_user_by_id', authMiddleware_1.default, (req, res, next) => {
    (0, userController_1.get_user_by_id)(req, res, next);
});
exports.default = router;
