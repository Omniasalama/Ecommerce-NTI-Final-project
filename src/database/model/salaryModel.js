/** @format */
import mongoose from "mongoose";

const salarySchema = new mongoose.Schema(
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
    baseSalary: {
      type: Number,
      required: true,
    },
    deductions: {
      type: Number,
      default: 0,
    },
    adjustments: {
      type: Number,
      default: 0,
    },
    finalSalary: {
      type: Number,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    salarySlipUrl: {
      type: String, 
    },
  },
  { timestamps: true }
);

export const salaryModel = mongoose.model("Salary", salarySchema);
