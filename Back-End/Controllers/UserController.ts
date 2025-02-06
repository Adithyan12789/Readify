import asyncHandler from "express-async-handler"
import type { Request, Response } from "express"
import type { CustomRequest } from "../Middlewares/AuthMiddleware"
import { inject, injectable } from "inversify"
import type { IUserService } from "../Interface/IUser/IService"
import TokenService from "../Utils/GenerateToken"
import EmailUtil from "../Utils/EmailUtil" // Import EmailUtil

@injectable()
export class UserController {
  constructor(
    @inject("IUserService") private readonly userService: IUserService
  ) {}

  refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.cookies["refreshToken"]

    if (!refreshToken) {
      res.status(401).json({ message: "No refresh token provided" })
      return
    }

    const decoded = TokenService.verifyRefreshToken(refreshToken)

    if (!decoded || typeof decoded === "string") {
      res.status(401).json({ message: "Invalid or expired refresh token" })
      return
    }

    try {
      const user = await this.userService.getUserProfile(decoded.userId)

      if (!user) {
        res.status(404).json({ message: "User not found" })
        return
      }

      if (!user._id) {
        res.status(500).json({ message: "User ID is missing" })
        return
      }
      const newAccessToken = TokenService.generateAccessToken(user._id.toString())      

      res.cookie("jwt_access", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      })

      res.status(200).json({ message: "Token refreshed successfully" })
    } catch (error) {
      console.error("Error finding user:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  }

  authUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" })
      return
    }

    try {
      const user = await this.userService.authenticateUser(email, password)

      const accessToken = TokenService.generateAccessToken(user._id.toString())
      const refreshToken = TokenService.generateRefreshToken(user._id.toString())

      TokenService.setTokenCookies(res, accessToken, refreshToken)

      res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
      })
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message === "Your account is blocked") {
          res.status(401).json({
            message: "Your account is blocked. Please contact support.",
          })
        } else if (err.message === "Invalid Email or Password") {
          res.status(401).json({ message: "Invalid email or password" })
        } else {
          res.status(500).json({ message: "An error occurred during authentication" })
        }
      } else {
        res.status(500).json({ message: "An error occurred during authentication" })
      }
    }
  })

  googleLogin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { googleName: name, googleEmail: email } = req.body

    if (!email || !name) {
      res.status(400).json({ message: "Google Name and Email are required" })
      return
    }

    try {
      const user = await this.userService.googleLogin(name, email)

      const accessToken = TokenService.generateAccessToken(user._id.toString())
      const refreshToken = TokenService.generateRefreshToken(user._id.toString())

      TokenService.setTokenCookies(res, accessToken, refreshToken)
      res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      })
    } catch (error: any) {
      res.status(500).json({ message: "Internal server error", error: error.message })
    }
  })

  registerUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, phone } = req.body

    try {
      const user = await this.userService.registerUser(name, email, password, phone)
      const otpSent = !user.otpVerified

      if (!otpSent) {
        const accessToken = TokenService.generateAccessToken(user._id.toString())
        const refreshToken = TokenService.generateRefreshToken(user._id.toString())
        TokenService.setTokenCookies(res, accessToken, refreshToken)
      }

      res.status(201).json({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        otpSent,
        message: otpSent ? "User registered successfully. OTP sent." : "User already registered but OTP not verified.",
      })
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message === "Email already exists.") {
          res.status(400).json({ message: "User with this email already exists" })
        } else if (err.message === "Email exists but OTP is not verified.") {
          res.status(400).json({ message: "Email exists but OTP is not verified." })
        } else {
          res.status(500).json({ message: "An error occurred during registration" })
        }
      } else {
        res.status(500).json({ message: "An unexpected error occurred" })
      }
    }
  })

  verifyOTP = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, otp } = req.body

    try {
      await this.userService.verifyOtp(email, otp)
      res.status(200).json({ message: "OTP verified successfully" })
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "Incorrect OTP") {
        res.status(400).json({ message: "Incorrect OTP" })
      } else if (err instanceof Error && err.message === "OTP expired") {
        res.status(400).json({ message: "OTP has expired. Please request a new one" })
      } else {
        res.status(500).json({ message: "An error occurred during OTP verification" })
      }
    }
  })

  resendOtp = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body

    try {
      await this.userService.resendOtp(email)
      res.status(200).json({ message: "OTP resent successfully" })
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "User not found") {
        res.status(404).json({ message: "User with this email not found" })
      } else if (err instanceof Error && err.message === "Failed to send OTP") {
        res.status(500).json({ message: "Failed to resend OTP. Please try again" })
      } else {
        res.status(500).json({ message: "An unexpected error occurred" })
      }
    }
  })

  forgotPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body

    if (!email) {
      res.status(400).json({ message: "Email is required" })
      return
    }

    try {
      const resetToken = await this.userService.forgotPassword(email)
      const resetUrl = `https://api.readify.space/reset-password/${resetToken}`
      const message = `Password reset link: ${resetUrl}`

      await EmailUtil.sendOtpEmail(email, message) // Use EmailUtil here
      res.status(200).json({ message: "Password reset email sent" })
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "User not found") {
        res.status(404).json({ message: "User with this email not found" })
      } else if (err instanceof Error && err.message === "Failed to send email") {
        res.status(500).json({ message: "Failed to send reset email. Please try again" })
      } else {
        res.status(500).json({ message: "An error occurred during password reset request" })
      }
    }
  })

  resetPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { password } = req.body
    const resetToken = req.params.token

    if (!resetToken || !password) {
      res.status(400).json({ message: "Token and password are required" })
      return
    }

    try {
      await this.userService.resetPassword(resetToken, password)
      res.status(200).json({ message: "Password reset successfully" })
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "Invalid or expired token") {
        res.status(400).json({ message: "Invalid or expired token" })
      } else {
        res.status(500).json({ message: "An error occurred during password reset" })
      }
    }
  })

  getUserProfile = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" })
      return
    }

    try {
      const user = await this.userService.getUserProfile(req.user._id)
      res.status(200).json(user)
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "User not found") {
        res.status(404).json({ message: "User not found" })
      } else {
        res.status(500).json({ message: "An error occurred while fetching user profile" })
      }
    }
  })

  updateUserProfile = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" })
      return
    }

    try {
      const updateData = { ...req.body }
      const fileData = req.file ? { filename: req.file.filename } : { filename: undefined }

      if (updateData.password && !updateData.currentPassword) {
        res.status(400).json({ message: "Current password is required" })
        return
      }

      const updatedUser = await this.userService.updateUserProfile(req.user._id, updateData, fileData)

      if (!updatedUser) {
        res.status(404).json({ message: "User not found or update failed" })
        return
      }

      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        phone: updatedUser.phone,
        profileImageName: updatedUser.profileImageName,
      })
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "Current password is incorrect") {
        res.status(400).json({ message: "Current password is incorrect" })
      } else {
        res.status(500).json({ message: "An error occurred while updating user profile" })
      }
    }
  })

  logoutUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.userService.logoutUser()

    res.cookie("jwt", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      expires: new Date(0),
    })

    res.cookie("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      expires: new Date(0),
    })

    res.status(200).json({ message: "User Logged out" })
  })
}

