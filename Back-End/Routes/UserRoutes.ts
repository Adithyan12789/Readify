import express from 'express';
import UserController from '../Controllers/UserController';
import { AuthMiddleware } from '../Middlewares/AuthMiddleware';
import MulterConfig from '../Config/Multer';

const router = express.Router();

router.post('/auth', UserController.authUser);
router.post('/googleLogin', UserController.googleLogin);
router.post('/signup', UserController.registerUser);
router.post('/verifyotp', UserController.verifyOTP);
router.post('/resend-otp', UserController.resendOtp);
router.post('/forgot-password', UserController.forgotPassword);
router.put('/reset-password/:token', UserController.resetPassword);

router.post('/refresh-token', UserController.refreshToken);

router.route('/profile')
.get( AuthMiddleware, UserController.getUserProfile )
.put( AuthMiddleware, MulterConfig.multerUploadUserProfile.single('profileImage'), UserController.updateUserProfile);

router.post('/logout', UserController.logoutUser);

export default router;
