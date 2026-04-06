/** @format */
import {salaryModel} from "../../database/model/salaryModel.js";
import {attendanceModel} from "../../database/model/attendingModel.js";
import {deductionModel} from "../../database/model/deductionModel.js";

export const calculateMonthlySalary = async (req, res) => {
  try {
    const { id: staffId, month } = req.params;

    const [year, monthNum] = month.split("-");
    const monthStart = new Date(year, monthNum - 1, 1);
    const monthEnd = new Date(year, monthNum, 0, 23, 59, 59);

    const dailySalary = 100;

    const attendanceRecords = await attendanceModel.find({
      staff: staffId,
      date: { $gte: monthStart, $lte: monthEnd },
    });

    const workingDays = attendanceRecords.filter((att) => !att.absent).length;
    const lateDays = attendanceRecords.filter((att) => att.late).length;
    const absentDays = attendanceRecords.filter((att) => att.absent).length;

    const manualDeductions = await deductionModel.aggregate([
      {
        $match: {
          staff: staffId,
          month,
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);
    const totalManualDeductions =
      manualDeductions.length > 0 ? manualDeductions[0].totalAmount : 0;

    const baseSalary = dailySalary * workingDays;
    const deductions =
      lateDays * dailySalary * 0.1 +
      absentDays * dailySalary +
      totalManualDeductions;

    const existingSalaryRecord = await salaryModel.findOne({
      staff: staffId,
      month,
    });
    const adjustments = existingSalaryRecord
      ? existingSalaryRecord.adjustments
      : 0;

    const finalSalary = baseSalary - deductions + adjustments;

    res.status(200).json({
      staffId,
      month,
      baseSalary,
      deductions,
      adjustments,
      finalSalary,
      workingDays,
      lateDays,
      absentDays,
      isPaid: existingSalaryRecord ? existingSalaryRecord.isPaid : false,
      paidAt: existingSalaryRecord ? existingSalaryRecord.paidAt : null,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error calculating salary", error: error.message });
  }
};

export const markSalaryAsPaid = async (req, res) => {
  try {
    const { id: staffId, month } = req.params;

    let salary = await salaryModel.findOne({ staff: staffId, month });

    if (!salary) {
      return res
        .status(404)
        .json({ message: "Salary record not found for this month" });
    }

    if (salary.isPaid) {
      return res
        .status(400)
        .json({ message: "Salary is already marked as paid" });
    }

    salary.isPaid = true;
    salary.paidAt = new Date();

    await salary.save();

    res.status(200).json({ message: "Salary marked as paid", salary });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error marking salary as paid", error: error.message });
  }
};

export const adjustSalary = async (req, res) => {
  try {
    const { id: staffId, month } = req.params;
    const { adjustmentAmount } = req.body;

    if (typeof adjustmentAmount !== "number") {
      return res
        .status(400)
        .json({ message: "Adjustment amount must be a number" });
    }

    let salary = await salaryModel.findOne({ staff: staffId, month });

    if (!salary) {
      return res
        .status(404)
        .json({ message: "Salary record not found for this month" });
    }

    salary.adjustments = adjustmentAmount;

    salary.finalSalary =
      salary.baseSalary - salary.deductions + adjustmentAmount;

    await salary.save();

    res.status(200).json({ message: "Salary adjusted successfully", salary });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adjusting salary", error: error.message });
  }
};
