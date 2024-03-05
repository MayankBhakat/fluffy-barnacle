"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_all_houses_in_wishlist = exports.add_house_to_wishlist = exports.remove_house_from_wishlist = exports.get_single_home = exports.get_all_homes = void 0;
const SingleHomeModel_1 = __importDefault(require("../models/SingleHomeModel"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
const mongodb_1 = require("mongodb");
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
        if (city == "") {
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
            bathrooms: { $gte: bathroom, $lte: 500 }
        };
        if (type === "any") {
            query.type = { $in: type_arr };
        }
        else {
            query.type = type;
        }
        const totalDocuments = await SingleHomeModel_1.default.countDocuments(query);
        const home = await SingleHomeModel_1.default.find(query)
            .sort({ fees: 1, size: -1 })
            .skip(startIndex)
            .limit(limit);
        res.status(200).send({
            message: "DATA FETCHED SUCCESSFULLY",
            home: home,
            tot: totalDocuments,
            success: true,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.get_all_homes = get_all_homes;
const get_single_home = async (req, res, next) => {
    try {
        const home_id = new mongodb_1.ObjectId(req.query.home_id);
        const home = await SingleHomeModel_1.default.findById({ _id: home_id }); // Corrected findById parameter
        if (home) {
            return res.status(200).send({
                message: "HOUSE FETCHED SUCCESSFULLY",
                home: home,
                success: true,
            });
        }
    }
    catch (err) {
        return res.status(200).send({
            message: "HOUSE NOT FOUND",
            success: false,
        });
    }
};
exports.get_single_home = get_single_home;
const add_house_to_wishlist = async (req, res, next) => {
    const { user_id, house_id } = req.body;
    try {
        const userid = new mongodb_1.ObjectId(user_id);
        const curr_user = await UserModel_1.default.findById(userid);
        const houseid = new mongodb_1.ObjectId(house_id);
        const curr_house = await SingleHomeModel_1.default.findById(houseid);
        if (!curr_user || !curr_house) {
            return res.status(404).send({ message: "USER OR HOUSE NOT FOUND", success: false });
        }
        const index = curr_user.wishlist?.indexOf(house_id);
        console.log(index);
        // If house_id is not found in wishlist, return error
        if (index !== -1) {
            return res.status(404).send({ message: "HOUSE FOUND IN WISHLIST", success: false });
        }
        // Push the house_id into the wishlist array of curr_user
        curr_user.wishlist?.push(house_id);
        // Save the updated curr_user document
        await curr_user.save();
        return res.status(200).send({ message: "HOUSE ADDED TO WISHLIST SUCCESSFULLY", success: true });
    }
    catch (err) {
        return res.status(404).send({ message: "USER NOT FOUND", success: false });
        next(err);
    }
};
exports.add_house_to_wishlist = add_house_to_wishlist;
const remove_house_from_wishlist = async (req, res, next) => {
    const { user_id, house_id } = req.body;
    try {
        const userid = new mongodb_1.ObjectId(user_id);
        const curr_user = await UserModel_1.default.findById(userid);
        if (!curr_user) {
            return res.status(404).send({ message: "USER NOT FOUND", success: false });
        }
        // Find the index of the house_id in the wishlist array
        const index = curr_user.wishlist?.indexOf(house_id);
        // If house_id is not found in wishlist, return error
        if (index === -1) {
            return res.status(404).send({ message: "HOUSE NOT FOUND IN WISHLIST", success: false });
        }
        // Remove the house_id from the wishlist array
        curr_user.wishlist?.splice(index, 1);
        // Save the updated curr_user document
        await curr_user.save();
        return res.status(200).send({ message: "HOUSE REMOVED FROM WISHLIST SUCCESSFULLY", success: true });
    }
    catch (err) {
        res.status(404).send({ message: "USER NOT FOUND", success: false });
        next(err);
    }
};
exports.remove_house_from_wishlist = remove_house_from_wishlist;
const get_all_houses_in_wishlist = async (req, res, next) => {
    const user_id = req.query.user_id;
    try {
        const user = await UserModel_1.default.findById({ _id: user_id });
        if (!user) {
            return res.status(404).send({
                message: "USER NOT FOUND",
                success: false
            });
        }
        const ids = user.wishlist;
        const home_array = async (ids) => {
            const housedata = [];
            for (const homie of ids) {
                const houseid = new mongodb_1.ObjectId(homie);
                try {
                    const curr_house = await SingleHomeModel_1.default.findById(houseid);
                    housedata.push(curr_house);
                }
                catch (err) {
                    console.log(err);
                    return res.status(404).send({
                        message: "ERROR RETRIEVING THE HOUSES ONE BY ONE",
                        success: false
                    });
                }
            }
            return housedata;
        };
        home_array(ids)
            .then((housesData) => {
            return res.status(200).send({
                message: "HOUSES RETRIEVED SUCCESSFULLY",
                data: housesData,
                success: true
            });
        })
            .catch((err) => {
            console.log(err);
            return res.status(404).send({
                message: "ERROR RETRIEVING THE HOUSES",
                success: false
            });
        });
    }
    catch (err) {
        console.log(err);
        res.status(404).send({
            message: "USER NOT FOUND",
            success: false
        });
        next(err);
    }
};
exports.get_all_houses_in_wishlist = get_all_houses_in_wishlist;
