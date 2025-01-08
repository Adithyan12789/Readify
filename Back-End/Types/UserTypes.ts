import { Document } from "mongoose";
import { ObjectId } from "mongodb";

export interface IUser extends Document {
    _id: ObjectId;
    name: string;
    email: string;
    password: string;
    phone?: string;
    profileImageName?: string;
    otp?: string;
    otpExpires?: Date;
    otpVerified?: boolean;
    otpGeneratedAt?: Date;
    isBlocked?: boolean;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    matchPassword: (password: string) => Promise<boolean>;
  }