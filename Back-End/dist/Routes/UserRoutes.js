"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = __importDefault(require("../Controllers/UserController"));
const AuthMiddleware_1 = require("../Middlewares/AuthMiddleware");
const Multer_1 = __importDefault(require("../Config/Multer"));
const BookController_1 = __importDefault(require("../Controllers/BookController"));
const router = express_1.default.Router();
router.post('/auth', UserController_1.default.authUser);
router.post('/googleLogin', UserController_1.default.googleLogin);
router.post('/signup', UserController_1.default.registerUser);
router.post('/verifyotp', UserController_1.default.verifyOTP);
router.post('/resend-otp', UserController_1.default.resendOtp);
router.post('/forgot-password', UserController_1.default.forgotPassword);
router.put('/reset-password/:token', UserController_1.default.resetPassword);
router.post('/refresh-token', UserController_1.default.refreshToken);
router.route('/profile')
    .get(AuthMiddleware_1.AuthMiddleware, UserController_1.default.getUserProfile)
    .put(AuthMiddleware_1.AuthMiddleware, Multer_1.default.multerUploadUserProfile.single('profileImage'), UserController_1.default.updateUserProfile);
router.route('/books')
    .post(AuthMiddleware_1.AuthMiddleware, Multer_1.default.multerUpload.single('bookImage'), BookController_1.default.createBook)
    .get(BookController_1.default.getAllBooks);
router.route('/books/:id')
    .get(BookController_1.default.getBookById)
    .put(AuthMiddleware_1.AuthMiddleware, Multer_1.default.multerUpload.single('bookImage'), BookController_1.default.updateBook)
    .delete(AuthMiddleware_1.AuthMiddleware, BookController_1.default.deleteBook);
router.post('/logout', UserController_1.default.logoutUser);
exports.default = router;
