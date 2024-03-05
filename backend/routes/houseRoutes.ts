import express from 'express';
import { Request, Response ,NextFunction} from 'express';
import { get_all_homes,get_single_home,remove_house_from_wishlist,add_house_to_wishlist ,get_all_houses_in_wishlist} from '../controllers/houseControllers';
const router = express.Router();

router.get('/get_all_homes',(req:Request , res:Response , next:NextFunction) => {
    get_all_homes(req,res,next);
})

router.get('/get_single_home',(req:Request , res:Response , next:NextFunction) => {
    get_single_home(req,res,next);
})

router.post('/remove_house_from_wishlist',(req:Request , res:Response , next:NextFunction) => {
    remove_house_from_wishlist(req,res,next);
})

router.post('/add_house_to_wishlist',(req:Request , res:Response , next:NextFunction) => {
    add_house_to_wishlist(req,res,next);
})


router.get('/get_all_houses_in_wishlist',(req:Request , res:Response , next:NextFunction) => {
    get_all_houses_in_wishlist(req,res,next);
})



export default router;