const express = require ("express")
const razorpay = require ("razorpay")
const Razorpay = require ("razorpay")
const dotenv = require('dotenv');
const crypto = require("crypto");
const Installment = require('../models/InstallmentModel.js');
const User = require("../models/UserModel.js");
const SingleHome = require('../models/SingleHomeModel');

dotenv.config();


const razorpay_payment = async(req,res,next) =>{
    try{
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
        });

        const options = req.body;
        const order = await razorpay.orders.create(options);
        if(!order){
            return res.status(500).send("Error");
        }
        res.json(order);
    }catch(error){
        console.log(error);
        res.status(500).send("Error");
    }

}

const razorpay_validate= async(req,res,next) =>{
    let hose__2 = null;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature ,house_id, user_id, price,installment_number,email,sell_rent} =
    req.body;

  const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = sha.digest("hex");
  if (digest !== razorpay_signature) {
    return res.status(400).send({ 
      success:false,
      messageg: "TRANSACTION IS NOT LEGIT!" ,
    });
  }
  try{
  const installment = await Installment.create({
    user_id:user_id,
    house_id:house_id,
    order_id:razorpay_order_id,
    signature:razorpay_signature,
    payment_id:razorpay_payment_id,
    payment_amount:price,
    installment_number:installment_number,
    rent_sell:sell_rent,
  })
    try{
      const user = await User.findOne({ email: email });

      try{


        if(installment_number==0){
        const now = new Date();
        const one = new Date();
        const two = new Date();
        const three = new Date();
        const four = new Date();

        one.setMonth(now.getMonth()+1);
        two.setMonth(now.getMonth()+3);
        three.setMonth(now.getMonth()+6);
        four.setMonth(now.getMonth()+10);



        const newOrderItem = {
          house_id: house_id,
          installment_0: { status: true, due_date: now },
          installment_1: { status: false, due_date: one},
          installment_2: { status: false, due_date: two },
          installment_3: { status: false, due_date: three },
          installment_4: { status: false, due_date: four },
      };

      user.orderlist.push(newOrderItem);
     
      try{
       
        const house = await SingleHome.findOne({_id:house_id});
        console.log(house);
        house.status.available = false;
        house.status.booked_by = user_id;
        house.status.sell_order=(newOrderItem);
        await house.save();
       

      }catch(error){
        console.log(error,"maysd");
        return res.status(400).send({
          success:false,
          message:"ERROR IN SAVING DETAILS IN HOUSE FOR SELL",
        })
      }
    }
    else{
      const order = user.orderlist.find(order => order.house_id == house_id);
      const house = await SingleHome.findOne({_id:house_id});


      if (!order || !house) {
          return res.status(404).send({
              success: false,
              message: "ORDER NOT FOUND",
          });
      }
      else{
        if(installment_number==1){
          order.installment_1.status=true;
          house.status.sell_order.installment_1.status=true;
        }
        if(installment_number==2){
          order.installment_2.status=true;
          house.status.sell_order.installment_2.status=true;
        }
        if(installment_number==3){
          order.installment_3.status=true;
          house.status.sell_order.installment_3.status=true;
        }
        if(installment_number==4){
          order.installment_4.status=true;
          house.status.sell_order.installment_4.status=true;

          //Chatgpt please write ur logic here
          try {
            await Installment.deleteMany({
                user_id: user_id,
                house_id: house_id,
                installment_number: { $in: ["1", "2", "3", "4"] }
            });
            console.log("Installments deleted successfully");
        } catch (error) {
            console.log("Error deleting installments:", error);
            return res.status(500).send({
                success: false,
                message: "ERROR IN DELETING INSTALLMENTS",
            });
        }
        
        }
      }
      await house.save();
    }
     
      await user.save();

      }catch(err){
        console.log(err);
        return res.status(400).send({
          success:false,
          error:err,
          message:"ERROR OCCURED IN SETTING THE ORDER"
        })
      }
    }catch(err){
      return res.status(400).send({
        success:false,
        error:err,
        message:"USER NOT FOUND",
      })
    }

  res.status(200).send({
    success:true,
    message:"THE HOUSE IS BOOKED.PLEASE PROCEED TO COMPLETE THE QUATERLY INSTALLMENTS",
    // house:house__2
    // orderId: razorpay_order_id,
    // paymentId: razorpay_payment_id,
    // installment:installment
  });

  }catch(err){
  console.log("ERROR IN BOOKING HOUSE",err);
  next(err);
  }    
}



const razorpay_validate2= async(req,res,next) =>{
  let hose__2 = null;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature ,house_id, user_id, price,installment_number,email,sell_rent} =
  req.body;

const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
const digest = sha.digest("hex");
if (digest !== razorpay_signature) {
  return res.status(400).send({ 
    success:false,
    messageg: "TRANSACTION IS NOT LEGIT!" ,
  });
}
try{
const installment = await Installment.create({
  user_id:user_id,
  house_id:house_id,
  order_id:razorpay_order_id,
  signature:razorpay_signature,
  payment_id:razorpay_payment_id,
  payment_amount:price,
  installment_number:installment_number,
  rent_sell:sell_rent,
})
  try{
    const user = await User.findOne({ email: email });

    try{

      if(installment_number==0){
        user.rent_home_id=house_id;
        user.rent_order=false;
        await user.save();

      try{

      const house = await SingleHome.findOne({_id:house_id});
      house.status.available = false;
      house.status.booked_by = user_id;
      house.status.rent_order.curr_month=false;
      await house.save();

    }catch(error){
      return res.status(400).send({
        success:false,
        message:"ERROR IN SAVING DETAILS IN HOUSE FOR RENT",
      })
    }
  }
  else{
    user.rent_order=true;
    const house = await SingleHome.findOne({_id:house_id});
    house.status.rent_order.curr_month=true;
    await house.save();
  }

    await user.save();

    }catch(err){
      console.log(err);
      return res.status(400).send({
        success:false,
        error:err,
        message:"ERROR OCCURED SAVING USER"
      })
    }
  }catch(err){
    return res.status(400).send({
      success:false,
      error:err,
      message:"USER NOT FOUND",
    })
  }

res.status(200).send({
  success:true,
  message:"THE HOUSE IS BOOKED",

});

}catch(err){
console.log("ERROR IN BOOKING HOUSE",err);
next(err);
}    
}

module.exports = {razorpay_payment,razorpay_validate,razorpay_validate2};