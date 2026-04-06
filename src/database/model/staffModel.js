/** @format */

import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["admin", "manager", "staff"],
      default: "staff",
    },
    phone: { type: String },
    password: { type: String, required: true }, // hashed
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const staffModel = mongoose.model("Staff", staffSchema);
