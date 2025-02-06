import express from 'express';
import { UserController } from '../Controllers/UserController';
import { AuthMiddleware } from '../Middlewares/AuthMiddleware';
import MulterConfig from '../Config/Multer';
import { BookController } from '../Controllers/BookController';
import { container } from '../Config/Container';

const router = express.Router();

const userControllerr = container.get<UserController>("UserController");
const bookControllerr = container.get<BookController>("BookController");

router.post('/auth', userControllerr.authUser);
router.post('/googleLogin', userControllerr.googleLogin);
router.post('/signup', userControllerr.registerUser);
router.post('/verifyotp', userControllerr.verifyOTP);
router.post('/resend-otp', userControllerr.resendOtp);
router.post('/forgot-password', userControllerr.forgotPassword);
router.put('/reset-password/:token', userControllerr.resetPassword);

router.post('/refresh-token', userControllerr.refreshToken);

router.route('/profile')
.get( AuthMiddleware, userControllerr.getUserProfile )
.put( AuthMiddleware, MulterConfig.multerUploadUserProfile.single('profileImage'), userControllerr.updateUserProfile);


router.route('/books')
  .post(AuthMiddleware, MulterConfig.multerUpload.single('bookImage'), bookControllerr.createBook)
  .get(bookControllerr.getAllBooks);

router.route('/books/:id')
  .get(bookControllerr.getBookById)
  .put(AuthMiddleware, MulterConfig.multerUpload.single('bookImage'), bookControllerr.updateBook)
  .delete(AuthMiddleware, bookControllerr.deleteBook);


router.post('/logout', userControllerr.logoutUser);

export default router;
