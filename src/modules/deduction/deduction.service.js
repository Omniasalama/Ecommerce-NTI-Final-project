/** @format */
import {deductionModel} from "../../database/model/deductionModel.js";

export const addDeduction = async (req, res) => {
  try {
    const { id: staffId } = req.params;
    const { month, amount, reason, date } = req.body;

    if (!month || !amount || !reason) {
      return res
        .status(400)
        .json({ message: "Month, amount, and reason are required" });
    }

    const deduction = await deductionModel.create({
      staff: staffId,
      month,
      amount,
      reason,
      date: date ? new Date(date) : new Date(),
    });

    return res.status(201).json({
      message: "Deduction added successfully",
      deduction,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error adding deduction",
      error: error.message,
    });
  }
};

export const getStaffDeductions = async (req, res) => {
  try {
    const { id: staffId } = req.params;

    const deductions = await deductionModel
      .find({ staff: staffId })
      .sort({ date: -1 });

    return res.status(200).json({
      message: "Deductions retrieved successfully",
      deductions,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching deductions",
      error: error.message,
    });
  }
};

export const updateDeduction = async (req, res) => {
  try {
    const { id: staffId, deductionId } = req.params;
    const updates = req.body;

    const deduction = await deductionModel.findOneAndUpdate(
      { _id: deductionId, staff: staffId },
      updates,
      { new: true },
    );

    if (!deduction) {
      return res.status(404).json({ message: "Deduction not found" });
    }

    return res.status(200).json({
      message: "Deduction updated successfully",
      deduction,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating deduction",
      error: error.message,
    });
  }
};

export const removeDeduction = async (req, res) => {
  try {
    const { id: staffId, deductionId } = req.params;

    const deduction = await deductionModel.findOneAndDelete({
      _id: deductionId,
      staff: staffId,
    });

    if (!deduction) {
      return res.status(404).json({ message: "Deduction not found" });
    }

    return res.status(200).json({
      message: "Deduction removed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error removing deduction",
      error: error.message,
    });
  }
};
