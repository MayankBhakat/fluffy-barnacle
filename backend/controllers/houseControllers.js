const SingleHome = require('../models/SingleHomeModel');
const User = require('../models/UserModel.js');
const { ObjectId } = require('mongodb');
const {upload,uploadToCloudinary} = require('../utils/uploadfile')
const fs = require('fs')


const get_all_homes = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 0;
        const fees_beg = parseInt(req.query.fees_beg) || 0;
        const fees_end = parseInt(req.query.fees_end) || 5000;
        const size_beg = parseInt(req.query.size_beg) || 0;
        const size_end = parseInt(req.query.size_end) || 5000;
        const bedrooms = req.query.bedrooms || "any";
        const bathrooms = req.query.bathrooms || "any";
        const city = req.query.city || "";
        const type = req.query.type || "any";
        const sell_rent = req.query.sell_rent ;

        if (city === "") {
            return res.status(400).send({
                message: 'PLEASE CHOOSE CITY',
                data: null,
                success: false,
            });
        }

        const startIndex = 9 * page;
        const limit = 9;

        const cityRegex = new RegExp(`^${city}`, 'i');

        const bedroom = (bedrooms === "any") ? 1 : parseInt(bedrooms);
        const bathroom = (bathrooms === "any") ? 1 : parseInt(bathrooms);
        const type_arr = ["Bungalow", "Flat", "Duplex"];

        let query = {
            city: { $regex: cityRegex },
            fees: { $gte: fees_beg, $lte: fees_end },
            size: { $gte: size_beg, $lte: size_end },
            bedrooms: { $gte: bedroom, $lte: 500 },
            bathrooms: { $gte: bathroom, $lte: 500 },
            
        };

        if (sell_rent === "rent" || sell_rent === "sell") {
            query.sell_rent = sell_rent;
        }

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
            message: "DATA FETCHED SUCCESSFULLY",
            home: home,
            tot: totalDocuments,
            success: true,
        });

    } catch (error) {
        next(error);
    }
}

const get_single_home = async (req, res, next) => {
    try {
        const home_id = new ObjectId(req.query.home_id);

        const home = await SingleHome.findById(home_id);
        if (home) {
            return res.status(200).send({
                message: "HOUSE FETCHED SUCCESSFULLY",
                home: home,
                success: true,
            })
        }

    } catch (err) {
        return res.status(200).send({
            message: "HOUSE NOT FOUND",
            success: false,
        })
    }
}

const add_house_to_wishlist = async (req, res, next) => {
    const { user_id, house_id } = req.body;
    try {
        const userid = new ObjectId(user_id);
        const curr_user = await User.findById(userid);
        const houseid = new ObjectId(house_id);
        const curr_house = await SingleHome.findById(houseid);

        if (!curr_user || !curr_house) {
            return res.status(404).send({ message: "USER OR HOUSE NOT FOUND", success: false });
        }

        const index = curr_user.wishlist.indexOf(house_id);

        if (index !== -1) {
            return res.status(404).send({ message: "HOUSE FOUND IN WISHLIST", success: false });
        }

        curr_user.wishlist.push(house_id);

        await curr_user.save();

        return res.status(200).send({ message: "HOUSE ADDED TO WISHLIST SUCCESSFULLY", success: true });

    } catch (err) {
        return res.status(404).send({ message: "USER NOT FOUND", success: false });
        next(err);
    }
}

const remove_house_from_wishlist = async (req, res, next) => {
    const { user_id, house_id } = req.body;
    try {
        const userid = new ObjectId(user_id);
        const curr_user = await User.findById(userid);

        if (!curr_user) {
            return res.status(404).send({ message: "USER NOT FOUND", success: false });
        }

        const index = curr_user.wishlist.indexOf(house_id);

        if (index === -1) {
            return res.status(404).send({ message: "HOUSE NOT FOUND IN WISHLIST", success: false });
        }

        curr_user.wishlist.splice(index, 1);

        await curr_user.save();

        return res.status(200).send({ message: "HOUSE REMOVED FROM WISHLIST SUCCESSFULLY", success: true });

    } catch (err) {
        res.status(404).send({ message: "USER NOT FOUND", success: false });
        next(err);
    }
}

const get_all_houses_in_wishlist = async (req, res, next) => {
    const user_id = req.query.user_id;
    const sell_rent=req.query.sell_rent;
    try {
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).send({
                message: "USER NOT FOUND",
                success: false
            })
        }

        const ids = user.wishlist;

        const home_array = async (ids) => {
            const housedata = [];
            for (const homie of ids) {
                const houseid = new ObjectId(homie);
                
                try {
                    const curr_house = await SingleHome.findById(houseid);
                    if(curr_house.sell_rent == sell_rent)housedata.push(curr_house);
                    
                }
                catch (err) {
                    console.log(err);
                    return res.status(404).send({
                        message: "ERROR RETRIEVING THE HOUSES ONE BY ONE",
                        success: false
                    })
                }

            }
            return housedata;
        }

        home_array(ids)
            .then((housesData) => {
                return res.status(200).send({
                    message: "HOUSES RETRIEVED SUCCESSFULLY",
                    data: housesData,
                    success: true
                })
            })
            .catch((err) => {
                console.log(err);
                return res.status(404).send({
                    message: "ERROR RETRIEVING THE HOUSES",
                    success: false
                })
            })


    } catch (err) {
        console.log(err);
        res.status(404).send({
            message: "USER NOT FOUND",
            success: false
        })
        next(err);
    }
}

const add_home = async(req,res,next) =>{
    const {city,type,bedrooms,bathrooms,address,rent_price,area,sell_price,rent_or_sell} = req.body;

    if ((!city || !type || !bedrooms || !bathrooms || !address || !rent_or_sell || !area || req.files.length!=3) || (rent_or_sell=="sell" && !sell_price) || ((rent_or_sell=="rent" && !rent_price) )) {
        const files = req.files;
        for(const file of files){
            const { path } = file;
            fs.unlinkSync(path);
        }
        return res.status(400).send({ 
          success: false,
          message: 'ALL INPUT FIELDS ARE REQUIRED',
          data: null,
        });
      }

   
    const uploader = async (path) => {
        try {
            return await uploadToCloudinary(path, 'Images');
        } catch (error) {
            throw error;
        }
    };

    if (req.method === 'POST') {
        const urls = [];
        const files = req.files;
        for (const file of files) {
            const { path } = file;

            try {
                const newPath = await uploader(path);
                urls.push(newPath);
                fs.unlinkSync(path); // Remove the file after successful upload
            } catch (error) {
                console.error("Error uploading file to Cloudinary:", error);
            }
        } 
        
      
        
        try{
           const home = await SingleHome.create({
            image1 : urls[0].url,
            image2 : urls[1].url,
            image3 : urls[2].url,
            city : city,
            size: parseInt(area),
            bathrooms : parseInt(bathrooms),
            bedrooms : parseInt(bedrooms),
            type:type,
            fees:parseInt(rent_or_sell==="rent" ? rent_price:sell_price),
            year:2021,
            address:address,
            owner_id:'65a3743af1088ea9c527d65e',
            sell_rent:rent_or_sell

           })

           return res.status(200).send({
            success:true,
            message:"HOUSE CREATED SUCCESSFULLY",
            data:home
           })
        }catch(err){
           
            res.status(400).send({
                success:false,
                message:"ERROR IN CREATING HOUSE",
                error:err,

            })
            next(err)
          
        }

    } else {
        return res.status(405).json({
            err: "Images not uploaded successfully"
        });
        
    }
}

const order_list = async (req, res, next) => {
    try {
        const user_id = req.query.user_id;
        console.log(user_id);
        const bookedHouses = await SingleHome.find({ 'status.booked_by': user_id });

        res.status(200).send({
            success:true,
            data:bookedHouses,
            message:"BOOKED HOUSES RETRIEVED SUCCESSFULLY"
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({ 
            success:false,
            message:"ERROR IN ORDERLIST"
         });
    }
};

module.exports = {
    get_all_homes,
    get_single_home,
    remove_house_from_wishlist,
    add_house_to_wishlist,
    get_all_houses_in_wishlist,
    add_home,
    order_list
};
