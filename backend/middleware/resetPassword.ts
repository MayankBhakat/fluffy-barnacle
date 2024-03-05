import { Request, Response, NextFunction } from 'express';
import nodemailer from 'nodemailer';
import ResetPassword from '../models/UserResetPassword'; 
import { ObjectId } from 'mongodb';
import User from '../models/UserModel'; 
import { comparePasswords, hashPassword } from '../utils/hashPassword';


import dotenv from 'dotenv';


//U dont write dotenv.config() and it showsVerify_Email fails Error: Missing credentials for "PLAIN"
// [1]     at SMTPConnection._formatError 
dotenv.config();


//We need the version 4 submodule of uuid in our app
import {v4 as uuidv4} from 'uuid';

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{

        user : process.env.AUTH_EMAIL,
        pass : process.env.AUTH_PASS,
    },
});


const resetPasswordEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, randomCode } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send({ 
        success:false,
        message: "USER NOT FOUND" });
    }

    const userIdString = (user._id).toString();
    const existingResetPassword = await ResetPassword.findOne({ userId: userIdString });

    if (existingResetPassword) {
      return res.status(400).send({ 
        success:false,
        message: "PASSWORD RESET MAIL HAS ALREADY BEEN SENT" });
    }

    const uniqueString = uuidv4() + userIdString;
    const hashedUniqueString = hashPassword(uniqueString);

    const newResetPassword = await ResetPassword.create({
      userId: userIdString,
      uniqueString: hashedUniqueString,
      createdAt: Date.now(),
      expiresAt: Date.now() + 21600000,
      OTP_code:randomCode,
    });

    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Reset your password",
      html: `<p>Your OTP is ${randomCode}. You have 120 sec to enter the OTP</p>`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
      return res.status(201).json({
        success:true,
        message: 'PASSWORDRESET MAIL CREATED',
        statues: 'PENDING',
        userId: userIdString,
        uniqueString: uniqueString,
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      return res.status(400).json({ 
        success:false,
        message: "ERROR SENDING EMAIL" });
    }
  } catch (err) {
    console.error('Error in reset password function:', err);
    next(err);
  }
};


const resendresetPasswordEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, randomCode } = req.body;
  
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send({ 
        success:false,
        message: "USER NOT FOUND" });
    }

    const userIdString = (user._id).toString();
    const existingResetPassword = await ResetPassword.findOne({ userId: userIdString });

    if (existingResetPassword) {
     await ResetPassword.deleteOne({ userId: userIdString });
    }

    const uniqueString = uuidv4() + userIdString;
    const hashedUniqueString = hashPassword(uniqueString);

    const newResetPassword = await ResetPassword.create({
      userId: userIdString,
      uniqueString: hashedUniqueString,
      createdAt: Date.now(),
      expiresAt: Date.now() + 21600000,
      OTP_code:randomCode,
    });

    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Reset your password",
      html: `<p>Your OTP is ${randomCode}. You have 120 sec to enter the OTP</p>`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
      return res.status(201).json({
        success:true,
        message: 'PASSWORDRESET MAIL CREATED',
        statues: 'PENDING',
        userId: userIdString,
        uniqueString: uniqueString,
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      return res.status(400).send({ 
        message: "ERROR SENDING EMAIL",
        success: false });
    }
  } catch (err) {
    console.error('Error in reset password function:', err);
    next(err);
  }
};



const verify_reset_password_mail=async(req : Request,res :Response ,next: NextFunction) =>{
  try{
  const {userId,uniqueString,OTP,time} = req.params;

  
  
  const newResetPasswordExists = await ResetPassword.findOne({ userId });

  if(newResetPasswordExists){
    const OTP_code = newResetPasswordExists.OTP_code;
    const time2 = Number(time);
    if(time2<=3){
      return res.status(400).send({
        success:false,
        message:"USER TIMEOUT"
      });
    }
    if(OTP_code!==(OTP)){
      return res.status(400).send({
        success:false,
        message:"OTP IS INCORRECT"
      });
    }

    //We convert the string into time object
    if(new Date(newResetPasswordExists.expiresAt).getTime() < Date.now()){
      try{
      const delete_reset_password_object = await ResetPassword.deleteOne({userId});

      if(delete_reset_password_object){
        return res.status(400).send({
          success:false,
          message:'RESET PASSWORD MAIL DELETED DUE TO EXPIRY.'
        });
      }

      }catch(err){
        return res.status(400).send({
          success:false,
          message:'ERROR IN REMOVING EXPIRED VERIFICATION MAIL FROM DATABASE',
        });
      }
    }
    else{
       const match_hashing =  comparePasswords(uniqueString,newResetPasswordExists .uniqueString);
       if(match_hashing){
          res.status(201).send({
            success:false,
            message:'YOU CAN SET NEW PASSWORD'});
       }
       else{
        res.status(400).send({
          sucess:false,
          message:'THERE IS DISCREPENCY IN MATCHING THE STRINGS FOR EMAIL VERIFICATION'});
       }

    }
  }
  else{
    return res.status(401).send({
      success:false,
      message:'RESET PASSWOD DOESNOT EXIST'});
  }
  }
  catch(err){
    console.error('Error during user verification ', err);
    next(err);
  }

}

const set_new_password = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const {userId,uniqueString} = req.params;

        //The destructring of request body names should be same as whatever send in request.U cant name verifypassword as validate password
        const {password,verifypassword} = req.body;
        console.log(password,verifypassword);
        const newResetPasswordExists = await ResetPassword.findOne({ userId });
        const objectId = new ObjectId(userId);

        if(newResetPasswordExists){

            //We convert the string into time object
            if(new Date(newResetPasswordExists.expiresAt).getTime() < Date.now()){
              try{
              const delete_reset_password_object = await ResetPassword.deleteOne({userId});

              if(delete_reset_password_object){
                return res.status(400).send({
                  success:false,
                  message:'RESET PASSWORD MAIL DELETED DUE TO EXPIRY.'
                });
              }

              }catch(err){
                return res.status(400).send({
                  success:false,
                  message:'ERROR IN REMOVING EXPIRED VERIFICATION MAIL FROM DATABASE',
                });
              }
            }
            else{
               const match_hashing =  comparePasswords(uniqueString,newResetPasswordExists .uniqueString);
               if(match_hashing){
                    try{
                        const user_exists = await User.findOne({_id:objectId});
                        if(password===verifypassword){
                            const new_hash_password = hashPassword(password);
                            await User.updateOne({_id:objectId},{password:new_hash_password});
                            await ResetPassword.deleteOne({userId});
                            return res.status(201).send({
                              success:true,
                              message:'PASSWORD RESET SUCCESSFULLY'});
                        }
                        else{
                            return res.status(401).send({
                              success:true,
                              message:'BOTH PASSWORDS DO NOT MATCH'
                            });
                        }
                    }catch(err){
                        return res.status(400).send({
                          sucess:true,
                          message:'USER NOT FOUND'
                        });
                    }

               }
               else{
                res.status(400).send({
                  sucess:false,
                  message:'THERE IS DISCREPENCY IN MATCHING THE STRINGS FOR EMAIL VERIFICATION'});
               }

            }
          }
          else{
            return res.status(401).send({
              success:false,
              message:'RESET PASSWOD DOESNOT EXIST'});
          }
          }
          catch(err){
            console.error('Error during matching password ', err);
            next(err);
          }
}

export {resetPasswordEmail,resendresetPasswordEmail,verify_reset_password_mail,set_new_password};