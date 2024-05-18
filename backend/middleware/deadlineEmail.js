const nodemailer = require('nodemailer');
const User = require('../models/UserModel');
const dotenv = require('dotenv');
dotenv.config();


const sendEmail = (to, message) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.AUTH_EMAIL,
            pass: process.env.AUTH_PASS,
        }
    });

    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to,
        subject: 'Installment Due Date Passed',
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
    });
};

const deadlineEmail = async () => {
    const now = new Date();

    // Fetch users with overdue installments
    let users = null;
    try{
     users = await User.find({
        $or: [
            { 'orderlist.installment_1.due_date': { $lte: now }, 'orderlist.installment_1.status': false },
            { 'orderlist.installment_2.due_date': { $lte: now }, 'orderlist.installment_2.status': false },
            { 'orderlist.installment_3.due_date': { $lte: now }, 'orderlist.installment_3.status': false },
            { 'orderlist.installment_4.due_date': { $lte: now }, 'orderlist.installment_4.status': false },
        ],
    });
    }catch(err){
        console.log(err);
        next(err);
    }

    users.forEach(user => {
        const overdueInstallments = user.orderlist.filter(item => {
            return (
                (item.installment_1.due_date <= now && !item.installment_1.status) ||
                (item.installment_2.due_date <= now && !item.installment_2.status) ||
                (item.installment_3.due_date <= now && !item.installment_3.status) ||
                (item.installment_4.due_date <= now && !item.installment_4.status)
            );
        });

        if (overdueInstallments.length > 0) {
            const message = `Dear ${user.name},\n\nYou have overdue installments:\n\n` +
                overdueInstallments.map(item => {
                    const overdue = [];
                    if (item.installment_1.due_date <= now && !item.installment_1.status) overdue.push('Installment 1');
                    if (item.installment_2.due_date <= now && !item.installment_2.status) overdue.push('Installment 2');
                    if (item.installment_3.due_date <= now && !item.installment_3.status) overdue.push('Installment 3');
                    if (item.installment_4.due_date <= now && !item.installment_4.status) overdue.push('Installment 4');
                    return `House ID: ${item.house_id}, Overdue Installments: ${overdue.join(', ')}`;
                }).join('\n');

            sendEmail(user.email, message);
        }
    });
};

module.exports = deadlineEmail;
