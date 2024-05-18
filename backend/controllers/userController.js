const User = require('../models/UserModel.js');
const Installment = require('../models/InstallmentModel.js')
const { comparePasswords, hashPassword } = require('../utils/hashPassword');
const generateAuthToken = require('../utils/generateAuthToken');
const SingleHome = require('../models/SingleHomeModel');

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send({ 
        success: false,
        message: 'ALL INPUT FIELDS ARE REQUIRED',
        data: null,
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).send({ 
        success: false,
        message: 'USER WITH THIS EMAIL ALREADY EXISTS' ,
        data: null,
      });
    } else {
      const hashedPassword = hashPassword(password);

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        verification: false,
      });
      
      return res.send({
        success: true,
        message: 'USER CREATED. VERIFICATION EMAIL SENT.',
        userCreated: {
          _id: user._id,
          name: user.name,
          email: user.email,
          verification: user.verification,
        },
      });
    }
  } catch (err) {
    console.error('Error in registerUser:', err);
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({
        message: 'ALL INPUT FIELDS ARE REQUIRED',
        data: null,
        success: false,
      });
    }

    const user = await User.findOne({ email }).orFail();
    if (!user.verification) {
      return res.status(400).send({
        message: 'USER NOT VERIFIED. CHECK VERIFICATION MAIL SENT TO REGISTERED EMAIL',
        success: false,
        data: null,
      });
    }
    if (user && comparePasswords(password, user.password)) {
      const token = generateAuthToken(user._id, user.name, user.email, user.role);
      return res.status(201).send({
        success: true,
        message: "USER LOGGED IN",
        userLoggedIn: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        data: token,
      });
    } else {
      return res.status(401).send({
        message: "PASSWORD IS INCORRECT",
        success: false,
        data: null,
      });
    }
  } catch (err) {
    if (err.name === 'DocumentNotFoundError') {
      return res.status(401).send({
        message: 'USER NOT FOUND',
        success: false,
        data: null,
      });
    } else {
      console.log(err, 'Error in Login');
      next(err);
    }
  }
};

const get_user_by_id = async (req, res, next) => {
  const { _id, email, name, verification } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(200).send({
        success: true,
        message: "USER FETCHED SUCCESSFULLY",
        data: user,
      });
    } else {
      return res.status(400).send({
        success: false,
        message: "USER NOT FETCHED",
        data: null,
      });
    }
  } catch (error) {
    next(error);
  }
}


const cancel_payment = async (req, res, next) =>{
  const {email , house_id} = req.body;
  try{
    const user = await User.findOne({ email });
    if(!user){
      return res.status(400).send({
        success: false,
        message: "USER NOT FOUND",
      });
    }
    else{
        user.orderlist = user.orderlist.filter(order => order.house_id !== house_id);
        await user.save();
          try{
            const house = await SingleHome.findOne({_id:house_id});
            house.status.available = true;
            house.status.booked_by = null;
            house.status.sell_order = null;
            await house.save();
          }catch(err){
            return res.status(400).send({
              success:false,
              message:"ERROR IN CHANGING THE STATUS OF HOUSE",
            })
          }
        return res.status(200).send({
          success: true,
          message: "ORDER CANCELLED SUCCESSFULLY",
        });

    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}

const cancel_payment2 = async (req, res, next) =>{
  const {email , house_id} = req.body;
  try{
    const user = await User.findOne({ email });
    if(!user){
      return res.status(400).send({
        success: false,
        message: "USER NOT FOUND",
      });
    }
    else{
        user.rent_order=false;
        user.rent_home_id = null;
        await user.save();
          try{
            const house = await SingleHome.findOne({_id:house_id});
            house.status.available = true;
            house.status.booked_by = null;
            house.status.rent_order.months_due = [];
            house.status.rent_order.curr_month = false;
            await house.save();
          }catch(err){
            return res.status(400).send({
              success:false,
              message:"ERROR IN CHANGING THE STATUS OF HOUSE",
            })
          }
        return res.status(200).send({
          success: true,
          message: "ORDER CANCELLED SUCCESSFULLY",
        });

    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}

const get_all_transaction = async (req, res, next) => {
  const userId = req.query.user_id;
  try {
    // Find all transactions where user_id matches the provided userId
    const transactions = await Installment.find({ user_id: userId });

    // Check if transactions are found
    if (!transactions || transactions.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No transactions found for this user",
      });
    }

    // Send the transactions in the response
    return res.status(200).send({
      success: true,
      msg: "transaction send successfully",
      data: transactions,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};


module.exports = { registerUser, loginUser, get_user_by_id ,cancel_payment,get_all_transaction,cancel_payment2};
