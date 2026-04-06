/** @format */
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minLength: [2, "Too short"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minLength: [2, "Too short"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email must be unique"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    avatar: {
      type: String, 
      default: "uploads/default-avatar.png",
    },
    role: {
      type: String,
      default: "admin",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
    passwordChangedAt: Date, 
    otpCode: String, 
    otpExpires: Date, 
  },
  {
    timestamps: true, 
    versionKey: false,
  },
);

export const userModel = mongoose.model("User", userSchema);
