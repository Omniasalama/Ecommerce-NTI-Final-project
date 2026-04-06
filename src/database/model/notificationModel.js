/** @format */
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  type: { type: String, enum: ["offer", "announcement"], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  discountCode: { type: String },
  expiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }, 
});

export const notificationModel = mongoose.model(
  "Notification",
  notificationSchema,
);
