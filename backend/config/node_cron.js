const cron = require('node-cron');
const deadlineEmail = require('../middleware/deadlineEmail');
const check_rent_status = require('../middleware/resetRent');
const set_rent_status_for_all_user = require('../middleware/resetRent');

// Schedule the job to run on the 1st day of every month
cron.schedule('0 0 1 * *', async () => {
    try {
        await deadlineEmail();
    } catch (error) {
        console.error('Error sending emails:', error);
    }
});

cron.schedule('0 0 1 * *', async () => {
    try {
        await check_rent_status();
    } catch (error) {
        console.error('Error checking rent status of house:', error);
    }
});

cron.schedule('0 0 1 * *', async () => {
    try {
        await set_rent_status_for_all_user();
    } catch (error) {
        console.error('Error resetting rent of user:', error);
    }
});

