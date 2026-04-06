/** @format */

import express from "express";
import { auth, checkRole } from "../../middleware/auth.js";
import { upload } from "../../middleware/multer.js";
import {
  addProduct,
  updateProduct,
  softDeleteProduct,
  updateStock,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getProductsBySubcategory,
} from "./product.service.js";

const router = express.Router();

router.post("/", auth, upload().array("images"), addProduct);
router.put(
  "/:id",
  auth,
  checkRole("admin"),
  upload().array("images"),
  updateProduct,
);
router.delete("/:id", auth, checkRole("admin"), softDeleteProduct);
router.patch("/:id/stock", auth, checkRole("admin"), updateStock);

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.get("/category/:categoryId", getProductsByCategory);
router.get("/subcategory/:subcategoryId", getProductsBySubcategory);

export default router;
