const express = require('express');
const router = express.Router();
const { registerUser, loginUser, get_user_by_id, cancel_payment,get_all_transaction,cancel_payment2} = require('../controllers/userController');
const { sendVerificationEmail, verifyUser } = require('../middleware/verifyEmail');
const { resetPasswordEmail, verify_reset_password_mail, set_new_password, resendresetPasswordEmail } = require('../middleware/resetPassword');
const authMiddleware = require('../utils/authMiddleware');

router.post('/register', (req, res, next) => {
    registerUser(req, res, next);
});

router.post('/login', (req, res, next) => {
    loginUser(req, res, next);
});

router.get('/verify/:userId/:uniqueString', (req, res, next) => {
    verifyUser(req, res, next);
});

router.post('/verify', (req, res, next) => {
    sendVerificationEmail(req, res, next);
});

router.post('/reset_Password_Mail', (req, res, next) => {
    resetPasswordEmail(req, res, next);
});

router.post('/resend_reset_Password_Mail', (req, res, next) => {
    resendresetPasswordEmail(req, res, next);
});

router.get('/reset_Password_Mail/:userId/:uniqueString/:OTP/:time', (req, res, next) => {
    verify_reset_password_mail(req, res, next);
});

router.get('/transaction', (req, res, next) => {
    get_all_transaction(req, res, next);
});

router.post('/reset_password/:userId/:uniqueString', (req, res, next) => {
    set_new_password(req, res, next);
});

router.post('/get_user_by_id', authMiddleware, (req, res, next) => {
    get_user_by_id(req, res, next);
});

router.post('/cancel_payment', (req, res, next) => {
    cancel_payment(req, res, next);
});

router.post('/cancel_payment2', (req, res, next) => {
    cancel_payment2(req, res, next);
});

module.exports = router;
