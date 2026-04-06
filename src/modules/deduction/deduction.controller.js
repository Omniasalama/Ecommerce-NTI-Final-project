/** @format */
import express from "express";
import { auth, checkRole } from "../../middleware/auth.js";
import {
  addDeduction,
  getStaffDeductions,
  updateDeduction,
  removeDeduction,
} from "./deduction.service.js";

const router = express.Router();

router.post("/:id/deductions", auth, checkRole("admin"), addDeduction);
router.get("/:id/deductions", auth, checkRole("admin"), getStaffDeductions);
router.put(
  "/:id/deductions/:deductionId",
  auth,
  checkRole("admin"),
  updateDeduction,
);
router.delete(
  "/:id/deductions/:deductionId",
  auth,
  checkRole("admin"),
  removeDeduction,
);

export default router;
