const nodemailer = require('nodemailer');
const User = require('../models/UserModel.js');
const SingleHome = require('../models/SingleHomeModel');

const dotenv = require('dotenv');

dotenv.config();



let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    },
});

transporter.verify((err, success) => {
    if (err) {
        console.log("Verify_Email fails", err);
    } else {
        console.log("Verify_Email is ok", success);
    }
});

const sendOwnnershipEmail = async (req, res, next) => {
    try {
        const { email ,house_id} = req.body;

                const user = await User.findOne({email:email});
                const house = await SingleHome.findOneAndDelete({_id:house_id});
                // console.log(order.house_id);
                user.orderlist = user.orderlist.filter(order => order.house_id !== house_id);
                user.wishlist = user.wishlist.filter(home => home !== house_id);
                await user.save();

                const mailOptions = {
                    from: process.env.AUTH_EMAIL,
                    to: email,
                    subject: "House Ownership",
                    html: `<p>Congratulations on your new home! Wishing you many happy memories ahead!</p><p>Your house id is ${house_id}.All your documents will be verified and you can move on to your new house within a week.</p>`,
                };

                try {
                    await transporter.sendMail(mailOptions);
                    console.log('Email sent successfully');
                } catch (emailError) {
                    console.error('Error sending email:', emailError);
                    next(emailError);
                    return;
                }

                return res
                .status(201)
                .send({
                        success: true,
                        message: 'EMAIL SENT SUCCESSFULLY',
                });


    } catch (err) {
        console.log('Error occurred in send ownershipmail function', err);
        next(err);
    }
}

module.exports = sendOwnnershipEmail