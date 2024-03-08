const express = require('express');
const router = express.Router();
const { get_all_homes, get_single_home, remove_house_from_wishlist, add_house_to_wishlist, get_all_houses_in_wishlist ,add_home} = require('../controllers/houseControllers');
const {upload} = require('../utils/uploadfile')
const fs = require('fs')
const SingleHome = require('../models/SingleHomeModel');

router.get('/get_all_homes', (req, res, next) => {
    get_all_homes(req, res, next);
});

router.get('/get_single_home', (req, res, next) => {
    get_single_home(req, res, next);
});

router.post('/remove_house_from_wishlist', (req, res, next) => {
    remove_house_from_wishlist(req, res, next);
});

router.post('/add_house_to_wishlist', (req, res, next) => {
    add_house_to_wishlist(req, res, next);
});

router.get('/get_all_houses_in_wishlist', (req, res, next) => {
    get_all_houses_in_wishlist(req, res, next);
});

router.use('/add_home', upload.array('image'), async (req, res,next) => {
    add_home(req,res,next);
});

module.exports = router;


