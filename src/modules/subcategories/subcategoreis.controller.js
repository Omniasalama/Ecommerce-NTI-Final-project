import express from "express";
import { auth } from "../../middleware/auth.js";
import {
  createSubcategory,
  getAllSubcategories,
  updateSubcategory,
  deleteSubcategory,
  getSubcategoryDetails,
} from "./subcategories.service.js";
import { upload } from "../../middleware/multer.js";

const router = express.Router();
router.get("/", auth, getAllSubcategories);
router.post("/", auth, upload().single("image"), createSubcategory);
router.post("/", auth, createSubcategory);
router.put("/:id", auth, updateSubcategory);
router.delete("/:id", auth, deleteSubcategory);

router.get("/subcategories/:id", getSubcategoryDetails);


export default router;