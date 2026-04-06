/** @format */
import express from "express";
import { auth } from "../../middleware/auth.js";
import { checkIn, checkOut } from "./attending.service.js";

const router = express.Router();

router.post("/checkin", auth, checkIn);
router.post("/checkout", auth, checkOut);

export default router;
