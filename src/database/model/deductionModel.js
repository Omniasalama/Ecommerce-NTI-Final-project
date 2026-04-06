/** @format */
import mongoose from "mongoose";

const deductionSchema = new mongoose.Schema(
  {
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    month: {
      type: String, 
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const deductionModel = mongoose.model("Deduction", deductionSchema);
