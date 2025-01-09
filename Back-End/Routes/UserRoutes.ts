import express from 'express';
import UserController from '../Controllers/UserController';
import { AuthMiddleware } from '../Middlewares/AuthMiddleware';
import MulterConfig from '../Config/Multer';
import BookController from '../Controllers/BookController';

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


router.route('/books')
  .post(AuthMiddleware, MulterConfig.multerUpload.single('bookImage'), BookController.createBook)
  .get(BookController.getAllBooks);

router.route('/books/:id')
  .get(BookController.getBookById)
  .put(AuthMiddleware, MulterConfig.multerUpload.single('bookImage'), BookController.updateBook)
  .delete(AuthMiddleware, BookController.deleteBook);


router.post('/logout', UserController.logoutUser);

export default router;
