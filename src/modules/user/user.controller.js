/** @format */
import express from "express";
import { auth } from "../../middleware/auth.js";
import {
  getUserProfile,
  softDelete,
  updateProfile,
  uploadAvatar,
} from "./user.service.js";
import { upload } from "../../middleware/multer.js";

const router = express.Router();

router.get("/profile", auth, getUserProfile);
router.put("/profile", auth, updateProfile);
router.delete("/profile/:id", auth, softDelete);
router.post(
  "/upload-avatar/:id",
  auth,
  upload().single("avatar"),
  uploadAvatar,
);

export default router;
