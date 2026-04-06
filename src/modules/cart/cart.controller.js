import express from "express";
import { auth } from "../../middleware/auth.js";
import {
  addToCart,
  viewCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from "./cart.service.js";

const router = express.Router();

router.post("/", auth, addToCart);
router.get("/", auth, viewCart);
router.put("/:productId", auth, updateCartItemQuantity);
router.delete("/:productId", auth, removeCartItem);
router.delete("/", auth, clearCart);

export default router;