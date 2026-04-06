/** @format */
import express from "express";
import { auth, checkRole } from "../../middleware/auth.js";
import {
  createOrder,
  getMyOrders,
  getOrderDetails,
  getAllOrders,
  updateOrderStatus,
  stripeWebhook,
} from "./order.service.js";

const router = express.Router();

router.post("/checkout", auth, createOrder);

router.get("/", auth, getMyOrders);
router.get("/:id", auth, getOrderDetails);

router.get("/", auth, checkRole("admin"), getAllOrders);
router.patch("/:id/status", auth, checkRole("admin"), updateOrderStatus);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

export default router;
