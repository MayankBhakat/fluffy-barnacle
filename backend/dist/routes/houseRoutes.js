"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const houseControllers_1 = require("../controllers/houseControllers");
const router = express_1.default.Router();
router.get('/get_all_homes', (req, res, next) => {
    (0, houseControllers_1.get_all_homes)(req, res, next);
});
router.get('/get_single_home', (req, res, next) => {
    (0, houseControllers_1.get_single_home)(req, res, next);
});
router.post('/remove_house_from_wishlist', (req, res, next) => {
    (0, houseControllers_1.remove_house_from_wishlist)(req, res, next);
});
router.post('/add_house_to_wishlist', (req, res, next) => {
    (0, houseControllers_1.add_house_to_wishlist)(req, res, next);
});
router.get('/get_all_houses_in_wishlist', (req, res, next) => {
    (0, houseControllers_1.get_all_houses_in_wishlist)(req, res, next);
});
exports.default = router;
