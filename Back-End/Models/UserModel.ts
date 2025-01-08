import mongoose, { Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../Types/UserTypes";

const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    phone: { type: String, required: false },
    otp: { type: String, required: false },
    otpVerified: { type: Boolean, default: false },
    otpGeneratedAt: { type: Date, default: Date.now },
    isBlocked: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    profileImageName: { type: String },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
