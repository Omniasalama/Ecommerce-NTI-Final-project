/** @format */
import express from "express";
import { auth, checkRole } from "../../middleware/auth.js";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  createNotification,
} from "./notification.service.js";

const router = express.Router();

router.get("/", auth, getUserNotifications);
router.patch("/:id/read", auth, markNotificationAsRead);
router.patch("/read-all", auth, markAllNotificationsAsRead);

router.post("/", auth, checkRole("admin"), createNotification);

export default router;
