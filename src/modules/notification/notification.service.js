/** @format */
import { notificationModel } from "../../database/model/notificationModel.js";

export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await notificationModel
      .find({ $or: [{ user: userId }, { user: null }] })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Notifications retrieved successfully",
      notifications,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching notifications",
      error: error.message,
    });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await notificationModel.findOneAndUpdate(
      { _id: id },
      { read: true },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.status(200).json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating notification",
      error: error.message,
    });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await notificationModel.updateMany(
      { $or: [{ user: userId }, { user: null }], read: false },
      { read: true },
    );

    return res.status(200).json({
      message: "All notifications marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating notifications",
      error: error.message,
    });
  }
};

export const createNotification = async (req, res) => {
  try {
    const { userId, type, title, message, discountCode, expiresAt } = req.body;

    if (!type || !title || !message) {
      return res
        .status(400)
        .json({ message: "Type, title, and message required" });
    }

    const notification = await notificationModel.create({
      user: userId || null,
      type,
      title,
      message,
      discountCode,
      expiresAt,
    });

    return res.status(201).json({
      message: "Notification created successfully",
      notification,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating notification",
      error: error.message,
    });
  }
};
