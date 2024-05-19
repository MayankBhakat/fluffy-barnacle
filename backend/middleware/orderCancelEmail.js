const nodemailer = require('nodemailer');

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

const orderCancelEmail = async (req, res, next) => {
    try {
        const { user_id,installments,house_id,rent_sell} = req.body;
                const email = "subham.bhakat01@gmail.com"

                if(rent_sell=="sell"){
                const mailOptions = {
                    from: process.env.AUTH_EMAIL,
                    to: email,
                    subject: "Cancellation of House Sell Order",
                    html: `<p>Sir user_id ${user_id} has cancelled his order for ${house_id}.He has completed ${installments} installments so far.</p>`,
                };

                try {
                    await transporter.sendMail(mailOptions);
                    console.log('Email sent successfully');
                } catch (emailError) {
                    console.error('Error sending email:', emailError);
                    next(emailError);
                    return;
                }
            }
            else{
                const mailOptions = {
                    from: process.env.AUTH_EMAIL,
                    to: email,
                    subject: "Cancellation of House Rent",
                    html: `<p>Sir user_id ${user_id} has decided to discontinue his house rent for house  ${house_id}.</p>`,
                };

                try {
                    await transporter.sendMail(mailOptions);
                    console.log('Email sent successfully');
                } catch (emailError) {
                    console.error('Error sending email:', emailError);
                    next(emailError);
                    return;
                }
            }

                return res
                .status(201)
                .send({
                        success: true,
                        message: 'EMAIL SENT SUCCESSFULLY',
                });


    } catch (err) {
        console.log('Error occurred in send order cancellation mail function', err);
        next(err);
    }
}

module.exports = orderCancelEmail