import type { IUser } from "../../Types/UserTypes"

export interface IUserService {
  authenticateUser(email: string, password: string): Promise<IUser>
  registerUser(name: string, email: string, password: string, phone: string): Promise<IUser>
  verifyOtp(email: string, otp: string): Promise<boolean>
  resendOtp(email: string): Promise<IUser>
  forgotPassword(email: string): Promise<string>
  resetPassword(resetToken: string, password: string): Promise<boolean>
  getUserProfile(userId: string): Promise<Partial<IUser>>
  updateUserProfile(
    userId: string,
    updateData: {
      currentPassword?: string
      name: string
      phone: string
      password?: string
    },
    profileImage: { filename: string | undefined },
  ): Promise<IUser | null>
  logoutUser(): boolean
  googleLogin(name: string, email: string): Promise<IUser>
}

