import { Request, Response, NextFunction } from 'express';
import nodemailer from 'nodemailer';
import UserVerification from '../models/UserVerificationModel'; 
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

transporter.verify((err,success)=>{
    if(err){
        console.log("Verify_Email fails",err);
    }else{
        console.log("Verify_Email is ok",success);
    }

})


const sendVerificationEmail = async (req: Request,res : Response,next: NextFunction)=>{
    try{
    const { email} = req.body;

    try{
      const user_present = await User.findOne({email});
      if(user_present){
        const _id=user_present._id;
        //Convert id to string as it is stored in string format in db
    const userIdString = _id.toString(); // Convert ObjectId to string
    const currentUrl = "http://localhost:5050";

    //generate unique string
    const uniqueString = uuidv4() + userIdString;
    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Verify your Email",
        html : `<p>Verify your email address to complete the signup and login into your account</p><p>This link <b>expires in 6 hrs</b></p>.<p>Press <a href=${currentUrl + "/api/users/verify/" + _id +"/" + uniqueString}>here</a> to proceed</p>`,   
    };

    const hashedUniqueString = hashPassword(uniqueString);

    const newVerification = await UserVerification.create({
       userId : userIdString,
       uniqueString: hashedUniqueString,
       createdAt : Date.now(),
       expiresAt : Date.now()+21600000,
      });

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
      } catch (emailError) {
        // Handle errors related to email sending
        console.error('Error sending email:', emailError);
        next(emailError); // Propagate the error to the Express error-handling middleware
        return; // Stop execution here to prevent continuing to the response logic
      }

    return res
    .status(201)
    .send({
        success:true,
        message: 'NEW VERIFICATION MAIL CREATED',
        statues: 'PENDING',
      });

      }
    }catch(err){
      return res.status(400).send({
        message:'USER WITH THIS ID NOT FOUND',
        success:false,
      });
    }
   
    
    }catch (err) {
        console.error('Error occured in sendverification mail function', err);
        next(err);
      }

    
}

const verifyUser=async(req : Request,res :Response ,next: NextFunction) =>{
  try{
  const {userId,uniqueString} = req.params;
  const newverificationExists = await UserVerification.findOne({ userId });
  // console.log(newverificationExists);
  const objectId = new ObjectId(userId);

  if(newverificationExists){

    //We convert the string into time object
    if(new Date(newverificationExists.expiresAt).getTime() < Date.now()){
      try{
      await User.deleteOne({_id:objectId});
      const check_verification = await UserVerification.deleteOne({userId});

      if(check_verification){
        return res.status(400).send({
          message:'VERIFICATION MAIL DELETED DUE TO EXPIRY.NEED TO REGISTER AGAIN',
          success:false,
         });
      }
      
      }catch(err){
        return res.status(400).send({
          message:'ERROR IN REMOVING EXPIRED VERIFICATION MAIL FROM DATABASE',
          success:false,
        });
      }
    }
    else{
       const match_hashing =  comparePasswords(uniqueString,newverificationExists.uniqueString);
       if(match_hashing){
        try{
          await UserVerification.deleteOne({userId});
          await User.updateOne({_id:objectId},{verification:true});
          res.status(201).send({
            message:'USER VERIFIED SUCCESSFULLY.NOW YOU CAN GO TO LOGIN PAGE AND LOG IN',
            success:true,
          });

        }catch(err){
          console.log('Failure in updating user');
          next(err);
        }
       }
       else{
        res.status(400).send({
          message:'THERE IS DISCREPENCY IN MATCHING THE STRINGS FOR EMAIL VERIFICATION',
          success:false,
        });
       }
   
    }
  }
  else{
    return res.status(401).send({
    message:'USER VERIFICATION DOESNOT EXIST',
    success:false,
  });
  }
  }
  catch(err){
    console.error('Error during user verification ', err);
    next(err);
  }
  
}

export {sendVerificationEmail,verifyUser};