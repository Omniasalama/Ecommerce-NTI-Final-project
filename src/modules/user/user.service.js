/** @format */
import fs from "fs"; 
import { userModel } from "../../database/model/userModel.js";

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await userModel
      .findOne({ _id: userId, isDeleted: false })
      .select(
        "-password -isDeleted -role -createdAt -updatedAt -__v -passwordChangedAt",
      );
    if (!user) {
      return res.status(404).json({
        message: "The user is not found or has been deleted",
      });
    }
    res.status(200).json({
      message: "User profile retrieved successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong with our server",
      error: err.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { firstName, lastName, phone } = req.body;

    const user = await userModel
      .findOneAndUpdate(
        { _id: userId, isDeleted: false },
        { firstName, lastName, phone },
        { new: true },
      )
      .select(
        "-password -isDeleted -role -createdAt -updatedAt -passwordChangedAt",
      );

    if (!user) {
      return res.status(404).json({
        message: "The user is not found or has been deleted",
      });
    }

    res.status(200).json({
      message: "User profile updated successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong with our server",
      error: err.message,
    });
  }
};

export const softDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({
        message: "The user is already deleted or not found",
      });
    }

    res.status(200).json({
      message: "User account deactivated (soft deleted) successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong with our server",
      error: err.message,
    });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image file" });
    }

    const { id } = req.params;
    const newAvatarPath = req.file.path;

    const user = await userModel.findOne({ _id: id, isDeleted: false });

    if (!user) {
      if (fs.existsSync(newAvatarPath)) fs.unlinkSync(newAvatarPath);

      return res.status(404).json({
        message: "User not found or account has been deleted",
      });
    }

    if (user.avatar && user.avatar !== "uploads/default-avatar.png") {
      if (fs.existsSync(user.avatar)) {
        fs.unlinkSync(user.avatar);
      }
    }
    user.avatar = newAvatarPath;
    await user.save();

    res.status(200).json({
      message: "Avatar updated successfully",
      data: { avatar: user.avatar },
    });
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      message: "Something went wrong with our server",
      error: err.message,
    });
  }
};
