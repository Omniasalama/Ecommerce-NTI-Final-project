/** @format */
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    checkInTime: {
      type: Date,
      required: true,
    },
    checkOutTime: {
      type: Date,
      default: null,
    },
    late: {
      type: Boolean,
      default: false,
    },
    workingHours: {
      type: Number,
      default: 0,
    },
    deductionHours: {
      type: Number,
      default: 0,
    },
    absent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const attendanceModel = mongoose.model("Attendance", attendanceSchema);
