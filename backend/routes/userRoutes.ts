import express from 'express';
import { Request, Response ,NextFunction} from 'express';
import { registerUser , loginUser ,get_user_by_id} from '../controllers/userController';
import {sendVerificationEmail,verifyUser} from '../middleware/verifyEmail';
import { resetPasswordEmail,verify_reset_password_mail,set_new_password ,resendresetPasswordEmail} from '../middleware/resetPassword';
import authMiddleware from '../utils/authMiddleware';

const router = express.Router();

router.post('/register', (req: Request, res: Response , next:NextFunction) => {
  registerUser(req, res, next);
});

router.post('/login', (req: Request, res: Response , next:NextFunction) => {
    loginUser(req, res, next);
  });

router.get('/verify/:userId/:uniqueString', (req: Request, res: Response , next:NextFunction) => {
  verifyUser(req, res, next);
});

router.post('/verify', (req: Request, res: Response , next:NextFunction) => {
  sendVerificationEmail(req, res, next);
});

router.post('/reset_Password_Mail', (req: Request, res: Response , next:NextFunction) => {
  resetPasswordEmail(req, res, next);
});

router.post('/resend_reset_Password_Mail', (req: Request, res: Response , next:NextFunction) => {
  resendresetPasswordEmail(req, res, next);
});

router.get('/reset_Password_Mail/:userId/:uniqueString/:OTP/:time', (req: Request, res: Response , next:NextFunction) => {
  verify_reset_password_mail(req, res, next);
});

router.post('/reset_password/:userId/:uniqueString', (req: Request, res: Response , next:NextFunction) => {
  set_new_password (req, res, next);
});

router.post('/get_user_by_id', authMiddleware,(req: Request, res: Response , next:NextFunction) => {
  get_user_by_id (req, res, next);
});


export default router;
