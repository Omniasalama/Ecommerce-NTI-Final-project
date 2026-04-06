/** @format */

import express from "express";

import { validator } from "../../common/utils/validataion.js";
import { signupSchema, loginSchema } from "./auth.validate.js";
import {
  signUp,
  login,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
} from "./auth.service.js";
import { upload } from "../../middleware/multer.js";

const router = express.Router();

router.post(
  "/signup",
  upload().single("avatar"),
  validator(signupSchema),
  signUp,
);
router.post("/login", validator(loginSchema), login);
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
export default router;
