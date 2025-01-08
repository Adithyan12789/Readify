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

export interface IBook extends Document {
  _id: ObjectId;
  title: string;
  author: string;
  publicationYear: number;
  isbn: string; // Changed to string to match schema
  description?: string; // Optional field
  image: string;
}