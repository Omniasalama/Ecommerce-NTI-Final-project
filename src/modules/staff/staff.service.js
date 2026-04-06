/** @format */

import { staffModel } from "../../database/model/staffModel.js";
import { userModel } from "../../database/model/userModel.js";

export const addStaff = async (req, res) => {
  try {
    const { user, dailySalary, department, joinDate } = req.body;

    const userExist = await userModel.findById(user);
    if (!userExist) return res.status(404).json({ message: "User not found" });

    const alreadyStaff = await staffModel.findOne({ user });
    if (alreadyStaff)
      return res.status(401).json({ message: "Staff already exists" });

    const staff = await staffModel.create({
      user,
      dailySalary,
      department,
      joinDate,
    });

    userExist.role = "staff";
    await userExist.save();

    return res.status(200).json({ message: "Staff member added", staff });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllStaff = async (req, res) => {
  try {
    const staff = await staffModel.find({ isActive: true }).populate("user");

    if (!staff.length)
      return res.status(404).json({ message: "No staff found" });

    return res.status(200).json({ staff });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getStaffDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await staffModel.findById(id).populate("user");
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    return res.status(200).json({ staff });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateStaffInfo = async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await staffModel.findById(id).populate("user");
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    const { dailySalary, department } = req.body;
    if (dailySalary !== undefined) staff.dailySalary = dailySalary;
    if (department !== undefined) staff.department = department;

    await staff.save();
    return res
      .status(200)
      .json({ message: "Staff updated successfully", staff });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await staffModel.findById(id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    if (!staff.isActive) return res.json({ message: "Staff already deleted" });

    staff.isActive = false;
    await staff.save();

    return res.status(200).json({ message: "Staff deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
