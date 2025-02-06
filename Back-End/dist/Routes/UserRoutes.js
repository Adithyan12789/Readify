"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = require("../Middlewares/AuthMiddleware");
const Multer_1 = __importDefault(require("../Config/Multer"));
const Container_1 = require("../Config/Container");
const router = express_1.default.Router();
const userControllerr = Container_1.container.get("UserController");
const bookControllerr = Container_1.container.get("BookController");
router.post('/auth', userControllerr.authUser);
router.post('/googleLogin', userControllerr.googleLogin);
router.post('/signup', userControllerr.registerUser);
router.post('/verifyotp', userControllerr.verifyOTP);
router.post('/resend-otp', userControllerr.resendOtp);
router.post('/forgot-password', userControllerr.forgotPassword);
router.put('/reset-password/:token', userControllerr.resetPassword);
router.post('/refresh-token', userControllerr.refreshToken);
router.route('/profile')
    .get(AuthMiddleware_1.AuthMiddleware, userControllerr.getUserProfile)
    .put(AuthMiddleware_1.AuthMiddleware, Multer_1.default.multerUploadUserProfile.single('profileImage'), userControllerr.updateUserProfile);
router.route('/books')
    .post(AuthMiddleware_1.AuthMiddleware, Multer_1.default.multerUpload.single('bookImage'), bookControllerr.createBook)
    .get(bookControllerr.getAllBooks);
router.route('/books/:id')
    .get(bookControllerr.getBookById)
    .put(AuthMiddleware_1.AuthMiddleware, Multer_1.default.multerUpload.single('bookImage'), bookControllerr.updateBook)
    .delete(AuthMiddleware_1.AuthMiddleware, bookControllerr.deleteBook);
router.post('/logout', userControllerr.logoutUser);
exports.default = router;
