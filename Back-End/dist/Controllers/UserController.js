"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const UserService_1 = __importDefault(require("../Services/UserService"));
const EmailUtil_1 = __importDefault(require("../Utils/EmailUtil"));
const UserModel_1 = __importDefault(require("../Models/UserModel"));
const GenerateToken_1 = __importDefault(require("../Utils/GenerateToken"));
class UserController {
    constructor() {
        this.refreshToken = async (req, res) => {
            const refreshToken = req.cookies["refreshToken"]; // Ensure it's the correct name
            // Check if refresh token exists
            if (!refreshToken) {
                res.status(401).json({ message: "No refresh token provided" });
                return;
            }
            // Verify the refresh token using TokenService
            const decoded = GenerateToken_1.default.verifyRefreshToken(refreshToken);
            if (!decoded || typeof decoded === "string") {
                res.status(401).json({ message: "Invalid or expired refresh token" });
                return;
            }
            // Find the user using the userId from the decoded token
            try {
                const user = await UserModel_1.default.findById(decoded.userId);
                if (!user) {
                    res.status(404).json({ message: "User not found" });
                    return;
                }
                // Generate new access token
                const newAccessToken = GenerateToken_1.default.generateAccessToken(user._id.toString());
                // Set the new access token in cookies
                res.cookie("jwt_access", newAccessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== "development",
                    sameSite: "strict",
                    maxAge: 15 * 60 * 1000, // 15 minutes
                });
                res.status(200).json({ message: "Token refreshed successfully" });
            }
            catch (error) {
                // Handle errors during user lookup (database issues, etc.)
                console.error("Error finding user:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        };
        this.authUser = (0, express_async_handler_1.default)(async (req, res) => {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({ message: "Email and password are required" });
                return;
            }
            try {
                const user = await UserService_1.default.authenticateUser(email, password);
                const accessToken = GenerateToken_1.default.generateAccessToken(user._id.toString());
                console.log("controller accessToken: ", accessToken);
                const refreshToken = GenerateToken_1.default.generateRefreshToken(user._id.toString());
                console.log("controller refreshToken: ", refreshToken);
                GenerateToken_1.default.setTokenCookies(res, accessToken, refreshToken);
                res.status(200).json({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                });
            }
            catch (err) {
                if (err instanceof Error) {
                    if (err.message === "Your account is blocked") {
                        res.status(401).json({
                            message: "Your account is blocked. Please contact support.",
                        });
                    }
                    else if (err.message === "Invalid Email or Password") {
                        res.status(401).json({ message: "Invalid email or password" });
                    }
                    else {
                        res
                            .status(500)
                            .json({ message: "An error occurred during authentication" });
                    }
                }
                else {
                    res
                        .status(500)
                        .json({ message: "An error occurred during authentication" });
                }
            }
        });
        this.googleLogin = (0, express_async_handler_1.default)(async (req, res) => {
            const { googleName: name, googleEmail: email } = req.body;
            if (!email || !name) {
                res.status(400).json({ message: "Google Name and Email are required" });
                return;
            }
            try {
                let user = await UserModel_1.default.findOne({ email });
                if (user) {
                    const accessToken = GenerateToken_1.default.generateAccessToken(user._id.toString());
                    const refreshToken = GenerateToken_1.default.generateRefreshToken(user._id.toString());
                    GenerateToken_1.default.setTokenCookies(res, accessToken, refreshToken);
                    res.status(200).json({
                        success: true,
                        data: {
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                        },
                    });
                }
                else {
                    user = await UserModel_1.default.create({
                        name,
                        email,
                        otp: "",
                        phone: "",
                        password: "",
                    });
                    if (user) {
                        const accessToken = GenerateToken_1.default.generateAccessToken(user._id.toString());
                        const refreshToken = GenerateToken_1.default.generateRefreshToken(user._id.toString());
                        GenerateToken_1.default.setTokenCookies(res, accessToken, refreshToken);
                        res.status(201).json({
                            success: true,
                            data: {
                                _id: user._id,
                                name: user.name,
                                email: user.email,
                            },
                        });
                    }
                    else {
                        res.status(400).json({ message: "Invalid user data" });
                    }
                }
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: "Internal server error", error: error.message });
            }
        });
        this.registerUser = (0, express_async_handler_1.default)(async (req, res) => {
            const { name, email, password, phone } = req.body;
            try {
                const user = await UserService_1.default.registerUserService(name, email, password, phone);
                const otpSent = !user.otpVerified;
                // If you want to log the user in after registration and send tokens
                if (!otpSent) {
                    // Generate both access and refresh tokens for new user
                    const accessToken = GenerateToken_1.default.generateAccessToken(user._id.toString());
                    const refreshToken = GenerateToken_1.default.generateRefreshToken(user._id.toString());
                    GenerateToken_1.default.setTokenCookies(res, accessToken, refreshToken);
                }
                res.status(201).json({
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    otpSent,
                    message: otpSent
                        ? "User registered successfully. OTP sent."
                        : "User already registered but OTP not verified.",
                });
            }
            catch (err) {
                if (err instanceof Error) {
                    if (err.message === "Email already exists.") {
                        res
                            .status(400)
                            .json({ message: "User with this email already exists" });
                    }
                    else if (err.message === "Email exists but OTP is not verified.") {
                        res
                            .status(400)
                            .json({ message: "Email exists but OTP is not verified." });
                    }
                    else {
                        res
                            .status(500)
                            .json({ message: "An error occurred during registration" });
                    }
                }
                else {
                    res.status(500).json({ message: "An unexpected error occurred" });
                }
            }
        });
        this.verifyOTP = (0, express_async_handler_1.default)(async (req, res) => {
            const { email, otp } = req.body;
            try {
                await UserService_1.default.verifyOtpService(email, otp);
                res.status(200).json({ message: "OTP verified successfully" });
            }
            catch (err) {
                if (err instanceof Error && err.message === "Incorrect OTP") {
                    res.status(400).json({ message: "Incorrect OTP" });
                }
                else if (err instanceof Error && err.message === "OTP expired") {
                    res
                        .status(400)
                        .json({ message: "OTP has expired. Please request a new one" });
                }
                else {
                    res
                        .status(500)
                        .json({ message: "An error occurred during OTP verification" });
                }
            }
        });
        this.resendOtp = (0, express_async_handler_1.default)(async (req, res) => {
            const { email } = req.body;
            try {
                await UserService_1.default.resendOtpService(email);
                res.status(200).json({ message: "OTP resent successfully" });
            }
            catch (err) {
                if (err instanceof Error && err.message === "User not found") {
                    res.status(404).json({ message: "User with this email not found" });
                }
                else if (err instanceof Error &&
                    err.message === "Failed to send OTP") {
                    res
                        .status(500)
                        .json({ message: "Failed to resend OTP. Please try again" });
                }
                else {
                    res.status(500).json({ message: "An unexpected error occurred" });
                }
            }
        });
        this.forgotPassword = (0, express_async_handler_1.default)(async (req, res) => {
            const { email } = req.body;
            if (!email) {
                res.status(400).json({ message: "Email is required" });
                return;
            }
            try {
                const resetToken = await UserService_1.default.forgotPasswordService(email);
                const resetUrl = `https://api.readify.space/reset-password/${resetToken}`;
                const message = `Password reset link: ${resetUrl}`;
                await EmailUtil_1.default.sendOtpEmail(email, message);
                res.status(200).json({ message: "Password reset email sent" });
            }
            catch (err) {
                if (err instanceof Error && err.message === "User not found") {
                    res.status(404).json({ message: "User with this email not found" });
                }
                else if (err instanceof Error &&
                    err.message === "Failed to send email") {
                    res
                        .status(500)
                        .json({ message: "Failed to send reset email. Please try again" });
                }
                else {
                    res.status(500).json({
                        message: "An error occurred during password reset request",
                    });
                }
            }
        });
        this.resetPassword = (0, express_async_handler_1.default)(async (req, res) => {
            const { password } = req.body;
            const resetToken = req.params.token;
            if (!resetToken || !password) {
                res.status(400).json({ message: "Token and password are required" });
                return;
            }
            try {
                await UserService_1.default.resetPasswordService(resetToken, password);
                res.status(200).json({ message: "Password reset successfully" });
            }
            catch (err) {
                if (err instanceof Error &&
                    err.message === "Invalid or expired token") {
                    res.status(400).json({ message: "Invalid or expired token" });
                }
                else {
                    res
                        .status(500)
                        .json({ message: "An error occurred during password reset" });
                }
            }
        });
        this.getUserProfile = (0, express_async_handler_1.default)(async (req, res) => {
            if (!req.user) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }
            const user = await UserService_1.default.getUserProfile(req.user._id);
            res.status(200).json(user);
        });
        this.updateUserProfile = (0, express_async_handler_1.default)(async (req, res) => {
            if (!req.user) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }
            try {
                const updateData = { ...req.body };
                const fileData = req.file
                    ? { filename: req.file.filename }
                    : { filename: undefined };
                // If password is being changed, validate currentPassword
                if (updateData.password) {
                    if (!updateData.currentPassword) {
                        res.status(400).json({ message: "Current password is required" });
                        return;
                    }
                }
                const updatedUser = await UserService_1.default.updateUserProfileService(req.user._id, updateData, fileData);
                res.status(200).json({
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    phone: updatedUser.phone,
                    profileImageName: updatedUser.profileImageName,
                });
            }
            catch (err) {
                if (err instanceof Error &&
                    err.message === "Current password is incorrect") {
                    res.status(404).json({ message: "Current password is incorrect" });
                }
                else {
                    res.status(500).json({
                        message: "An error occurred",
                    });
                }
            }
        });
        this.logoutUser = (0, express_async_handler_1.default)(async (req, res) => {
            // Optionally, you can perform any other cleanup actions related to the user session here
            await UserService_1.default.logoutUserService();
            // Clear the access token cookie (jwt)
            res.cookie("jwt", "", {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                sameSite: "strict",
                expires: new Date(0), // Expire the cookie immediately
            });
            // Clear the refresh token cookie
            res.cookie("refreshToken", "", {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                sameSite: "strict",
                expires: new Date(0), // Expire the cookie immediately
            });
            res.status(200).json({ message: "User Logged out" });
        });
    }
}
exports.default = new UserController();
