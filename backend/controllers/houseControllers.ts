import { Request, Response, NextFunction } from 'express';
import SingleHome from '../models/SingleHomeModel';
import User from '../models/UserModel';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';


const get_all_homes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 0;
        const fees_beg = parseInt(req.query.fees_beg as string) || 0;
        const fees_end = parseInt(req.query.fees_end as string) || 5000;
        const size_beg = parseInt(req.query.size_beg as string) || 0;
        const size_end = parseInt(req.query.size_end as string) || 5000;
        const bedrooms = req.query.bedrooms as string || "any";
        const bathrooms = req.query.bathrooms as string || "any";
        const city = req.query.city as string || "";
        const type = req.query.type as string || "any";

        if(city==""){
            return res.status(400).send({
                message:'PLEASE CHOOSE CITY',
                data:null,
                success:false,
              });
        }

        const startIndex = 9 * page;
        const limit = 9;

        const cityRegex = new RegExp(`^${city}`, 'i');

        const bedroom = (bedrooms === "any") ? 1 : parseInt(bedrooms);
        const bathroom = (bathrooms === "any") ? 1 : parseInt(bathrooms);
        const type_arr = ["Bungalow", "Flat", "Duplex"];

        let query: any = {
            city: { $regex: cityRegex },
            fees: { $gte: fees_beg, $lte: fees_end },
            size: { $gte: size_beg, $lte: size_end },
            bedrooms: { $gte: bedroom, $lte: 500 },
            bathrooms: { $gte: bathroom, $lte: 500 }
        };

        if (type === "any") {
            query.type = { $in: type_arr };
        } else {
            query.type = type;
        }

        const totalDocuments = await SingleHome.countDocuments(query);
        const home = await SingleHome.find(query)
            .sort({ fees: 1, size: -1 })
            .skip(startIndex)
            .limit(limit);

        res.status(200).send({
            message:"DATA FETCHED SUCCESSFULLY",
            home: home,
            tot: totalDocuments,
            success:true,
        });

    } catch (error) {
        next(error);
    }
}

const get_single_home = async (req: Request, res:Response, next:NextFunction)=>{
    try{
        const home_id = new ObjectId(req.query.home_id as string);
       
        const home = await SingleHome.findById({ _id: home_id }); // Corrected findById parameter
        if(home){
            return res.status(200).send({
                message:"HOUSE FETCHED SUCCESSFULLY",
                home:home,
                success:true,
            
            })
        }

    }catch(err){
        return res.status(200).send({
            message:"HOUSE NOT FOUND",
            success:false,
        })
    }
}

const add_house_to_wishlist = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id, house_id } = req.body;
    try {
        const userid = new ObjectId(user_id);
        const curr_user = await User.findById(userid);
        const houseid = new ObjectId(house_id);
        const curr_house = await SingleHome.findById(houseid);

        if (!curr_user || !curr_house) {
            return res.status(404).send({ message: "USER OR HOUSE NOT FOUND",success:false });
        }

        const index  = curr_user.wishlist?.indexOf(house_id);
        console.log(index);
        // If house_id is not found in wishlist, return error
        if (index !== -1) {
            return res.status(404).send({ message: "HOUSE FOUND IN WISHLIST", success: false });
        }

        // Push the house_id into the wishlist array of curr_user
        curr_user.wishlist?.push(house_id);

        // Save the updated curr_user document
        await curr_user.save();

        return res.status(200).send({ message: "HOUSE ADDED TO WISHLIST SUCCESSFULLY",success:true});

    } catch (err) {
        return res.status(404).send({message:"USER NOT FOUND",success:false});
        next(err);
    }
}

const remove_house_from_wishlist = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id, house_id } = req.body;
    try {
        const userid = new ObjectId(user_id);
        const curr_user = await User.findById(userid);

        if (!curr_user) {
            return res.status(404).send({ message: "USER NOT FOUND", success: false });
        }

        // Find the index of the house_id in the wishlist array
        const index  = curr_user.wishlist?.indexOf(house_id);

        // If house_id is not found in wishlist, return error
        if (index === -1) {
            return res.status(404).send({ message: "HOUSE NOT FOUND IN WISHLIST", success: false });
        }

        // Remove the house_id from the wishlist array
        curr_user.wishlist?.splice(index as number, 1 as number);

        // Save the updated curr_user document
        await curr_user.save();

        return res.status(200).send({ message: "HOUSE REMOVED FROM WISHLIST SUCCESSFULLY", success: true });

    } catch (err) {
        res.status(404).send({ message: "USER NOT FOUND", success: false })
        next(err);
    }
}

const get_all_houses_in_wishlist = async (req:Request, res:Response, next: NextFunction)=>{
    const user_id= req.query.user_id;
      try{
        const user =  await User.findById({_id:user_id});
        if(!user){
          return res.status(404).send({
            message:"USER NOT FOUND",
            success:false
          })
        }
  
        const ids:any= user.wishlist;

        const home_array = async(ids:any) =>{
            const housedata=[];
            for(const homie of ids){
                const houseid = new ObjectId(homie);
                try{ 
                const curr_house = await SingleHome.findById(houseid);
                housedata.push(curr_house);
                }
                catch(err){
                    console.log(err);
                    return res.status(404).send({
                        message:"ERROR RETRIEVING THE HOUSES ONE BY ONE",
                        success:false
                    })
                }

            }
            return housedata;
        }

        home_array(ids)
            .then((housesData)=>{
                return res.status(200).send({
                    message:"HOUSES RETRIEVED SUCCESSFULLY",
                    data:housesData,
                    success:true
                })
            })
            .catch((err)=>{
                console.log(err);
                return res.status(404).send({
                    message:"ERROR RETRIEVING THE HOUSES",
                    success:false
                })
            })
  
  
      }catch(err){
        console.log(err);
        res.status(404).send({
            message:"USER NOT FOUND",
            success:false
        })
        next(err);
      }
  }





export { get_all_homes ,get_single_home, remove_house_from_wishlist, add_house_to_wishlist, get_all_houses_in_wishlist};

