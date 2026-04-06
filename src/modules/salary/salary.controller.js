/** @format */
import express from "express";
import { auth, checkRole } from "../../middleware/auth.js";
import {
  calculateMonthlySalary,
  markSalaryAsPaid,
  adjustSalary,
} from "./salary.service.js";

const router = express.Router();

router.get(
  "/:id/salary/:month",
  auth,
  checkRole("admin"),
  calculateMonthlySalary,
);
router.post(
  "/:id/salary/:month/pay",
  auth,
  checkRole("admin"),
  markSalaryAsPaid,
);
router.put("/:id/salary/:month/adjust", auth, checkRole("admin"), adjustSalary);

export default router;
