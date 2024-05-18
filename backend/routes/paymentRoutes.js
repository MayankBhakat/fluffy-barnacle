const express = require('express');
const router = express.Router();
const {razorpay_payment,razorpay_validate,razorpay_validate2} = require('../middleware/razorpayPayment')


router.post('/order', (req, res, next) => {
    razorpay_payment(req, res, next);
});

router.post('/validate', (req, res, next) => {
    razorpay_validate(req, res, next);
});

router.post('/validate2', (req, res, next) => {
    razorpay_validate2(req, res, next);
});

module.exports = router;