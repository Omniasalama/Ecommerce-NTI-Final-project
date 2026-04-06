/** @format */
import {attendanceModel} from "../../database/model/attendingModel.js";

export const checkIn = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const existingCheckIn = await attendanceModel.findOne({
      staff: userId,
      date: {
        $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
      },
    });

    if (existingCheckIn) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    const lateCutoff = new Date(now);
    lateCutoff.setHours(9, 0, 0, 0);
    const isLate = now > lateCutoff;

    const attendance = await attendanceModel.create({
      staff: userId,
      checkInTime: now,
      late: isLate,
      date: now,
    });

    return res.status(201).json({
      message: isLate ? "Checked in late" : "Checked in successfully",
      attendance,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error during check-in",
      error: error.message,
    });
  }
};

export const checkOut = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const attendance = await attendanceModel.findOne({
      staff: userId,
      date: {
        $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
      },
    });

    if (!attendance) {
      return res.status(400).json({ message: "No check-in record for today" });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({ message: "Already checked out today" });
    }

    const workDurationMs = now - attendance.checkInTime;
    const workHours = workDurationMs / (1000 * 60 * 60);

    let deduction = 0;
    if (workHours < 8) {
      deduction = 8 - workHours;
    }

    attendance.checkOutTime = now;
    attendance.workingHours = workHours;
    attendance.deductionHours = deduction;
    attendance.absent = false;

    await attendance.save();

    return res.status(200).json({
      message: "Checked out successfully",
      attendance,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error during check-out",
      error: error.message,
    });
  }
};
