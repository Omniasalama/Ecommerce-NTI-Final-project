import express from "express";
import { auth } from "../../middleware/auth.js";
import { upload } from "../../middleware/multer.js";
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getAllActiveCategories,
  getSubCategoriesByCategory,
} from "./categories.service.js";

const router = express.Router();

router.get("/", auth, getAllCategories);
router.post("/", auth, upload().single("image"), createCategory);
router.put("/:id", auth, upload().single("image"), updateCategory);
router.delete("/:id", auth, deleteCategory);

router.get("/", getAllActiveCategories);
router.get("/:id/subcategories", getSubCategoriesByCategory);

export default router;