const express = require('express');
const router = express.Router();
const {razorpay_payment,razorpay_validate} = require('../middleware/razorpayPayment')


router.post('/order', (req, res, next) => {
    razorpay_payment(req, res, next);
});

router.post('/validate', (req, res, next) => {
    razorpay_validate(req, res, next);
});

module.exports = router;