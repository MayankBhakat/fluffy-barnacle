const User = require('../models/UserModel');
const SingleHome = require('../models/SingleHomeModel');


const check_rent_status = async(req,res,next)=>{
    try {
        const homes = await SingleHome.find();
    
        homes.forEach(async (home) => {
          if (home.status && home.status.rent_order) {
            if (home.status.rent_order.curr_month === false) {
              home.status.rent_order.months_due.push(new Date());
              console.log(`Added month to months_due for ${home._id}.`);
            }
            else{
                home.status.rent_order.curr_month = false; // Reset curr_month for the new month
            }
            await home.save();
          }
        });
      } catch (error) {
        console.error('Error during daily rent check:', error);
      }
}

const set_rent_status_for_all_user = async(req,res,next) =>{
    try {
        await User.updateMany({}, { $set: { rent_order: false } });
        console.log('Rent orders reset for all users.');
      } catch (error) {
        console.error('Error resetting rent orders:', error);
      }
}

module.exports = {check_rent_status,set_rent_status_for_all_user}

