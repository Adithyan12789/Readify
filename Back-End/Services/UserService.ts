import bcrypt from "bcryptjs"
import crypto from "crypto"
import EmailUtil from "../Utils/EmailUtil"
import { inject, injectable } from "inversify"
import type { IUserRepository } from "../Interface/IUser/IRepository"
import type { IUserService } from "../Interface/IUser/IService"
import type { IUser } from "../Types/UserTypes"

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository
  ) {}

  public async authenticateUser(email: string, password: string): Promise<IUser> {
    const user = await this.userRepository.findUserByEmail(email)

    if (!user) {
      throw new Error("Invalid Email or Password")
    }

    if (user.isBlocked) {
      throw new Error("Your account is blocked")
    }

    if (await user.matchPassword(password)) {
      return user
    }

    throw new Error("Invalid Email or Password")
  }

  public async registerUser(name: string, email: string, password: string, phone: string): Promise<IUser> {
    const existingUser = await this.userRepository.findUserByEmail(email)

    if (existingUser) {
      if (!existingUser.otpVerified) {
        const otp = crypto.randomInt(100000, 999999).toString()
        existingUser.otp = otp
        existingUser.otpVerified = false
        existingUser.otpGeneratedAt = new Date()
        await this.userRepository.saveUser(existingUser)

        await EmailUtil.sendOtpEmail(existingUser.email, otp)
        return existingUser
      }

      throw new Error("Email already exists.")
    }

    const otp = crypto.randomInt(100000, 999999).toString()
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = await this.userRepository.createUser({
      name,
      email,
      phone,
      password: hashedPassword,
      otp,
      otpVerified: false,
    })

    await EmailUtil.sendOtpEmail(newUser.email, otp)
    return newUser
  }

  public async verifyOtp(email: string, otp: string): Promise<boolean> {
    const user = await this.userRepository.findUserByEmail(email)
    if (!user) {
      throw new Error("User not found")
    }

    const OTP_EXPIRATION_TIME = 5 * 60 * 1000

    if (!user.otpGeneratedAt) {
      throw new Error("OTP generation time is missing")
    }

    const otpGeneratedAt = user.otpGeneratedAt || new Date(0)
    if (new Date().getTime() - otpGeneratedAt.getTime() > OTP_EXPIRATION_TIME) {
      throw new Error("OTP expired")
    }

    if (String(user.otp) === String(otp)) {
      user.otpVerified = true
      await this.userRepository.saveUser(user)
      return true
    }
    throw new Error("Incorrect OTP")
  }

  public async resendOtp(email: string): Promise<IUser> {
    const user = await this.userRepository.findUserByEmail(email)

    if (!user) {
      throw new Error("User not found")
    }

    const otp = crypto.randomInt(100000, 999999).toString()
    user.otp = otp
    user.otpExpires = new Date(Date.now() + 1 * 60 * 1000 + 59 * 1000)

    try {
      await this.userRepository.saveUser(user)
    } catch (err) {
      throw new Error("Failed to save user with new OTP")
    }

    try {
      await EmailUtil.sendOtpEmail(user.email, otp)
    } catch (err) {
      throw new Error("Failed to send OTP email")
    }

    return user
  }

  public async forgotPassword(email: string): Promise<string> {
    const user = await this.userRepository.findUserByEmail(email)
    if (!user) {
      throw new Error("User not found")
    }

    const resetToken = crypto.randomBytes(32).toString("hex")
    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000)
    await this.userRepository.saveUser(user)

    return resetToken
  }

  public async resetPassword(resetToken: string, password: string): Promise<boolean> {
    const user = await this.userRepository.findUserByResetToken(resetToken)
    if (!user) {
      throw new Error("Invalid or expired token")
    }

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined

    await this.userRepository.saveUser(user)

    return true
  }

  public async getUserProfile(userId: string): Promise<Partial<IUser>> {
    const user = await this.userRepository.findUserById(userId)

    if (!user) {
      throw new Error("User not found")
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImageName: user.profileImageName,
    }
  }

  public async updateUserProfile(
    userId: string,
    updateData: {
      currentPassword?: string
      name: string
      phone: string
      password?: string
    },
    profileImage: { filename: string | undefined },
  ): Promise<IUser | null> {
    const user = await this.userRepository.findUserById(userId)
    if (!user) {
      throw new Error("User not found")
    }

    if (updateData.password && updateData.currentPassword) {
      const isMatch = await user.matchPassword(updateData.currentPassword)
      if (!isMatch) {
        throw new Error("Current password is incorrect")
      }
    }

    user.name = updateData.name || user.name
    user.phone = updateData.phone || user.phone

    if (updateData.password) {
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(updateData.password, salt)
    }

    if (profileImage) {
      user.profileImageName = profileImage.filename || user.profileImageName
    }

    return await this.userRepository.saveUser(user)
  }

  public logoutUser(): boolean {
    return true
  }

  public async googleLogin(name: string, email: string): Promise<IUser> {
    let user = await this.userRepository.findUserByEmail(email)

    if (user) {
      return user
    } else {
      user = await this.userRepository.createUser({
        name,
        email,
        otp: "",
        phone: "",
        password: "",
      })
      return user
    }
  }
}

