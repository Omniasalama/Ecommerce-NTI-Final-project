/** @format */

import { cartModel } from "../../database/model/cartModel.js";
import { productModel } from "../../database/model/productModel.js";

const calculateCartTotals = (cart, productsMap) => {
  let totalQuantity = 0;
  let totalPrice = 0;

  for (const item of cart.items) {
    const product = productsMap.get(item.product.toString());
    if (product) {
      totalQuantity += item.quantity;
      totalPrice += product.price * item.quantity;
    }
  }
  cart.totalQuantity = totalQuantity;
  cart.totalPrice = totalPrice;
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1)
      return res
        .status(400)
        .json({ message: "ProductId and valid quantity are required" });

    const product = await productModel.findOne({
      _id: productId,
      isDeleted: false,
    });
    if (!product)
      return res.status(404).json({ message: "Product not found or inactive" });

    if (quantity > product.stock)
      return res
        .status(400)
        .json({ message: "Requested quantity exceeds stock" });

    let cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      cart = new cartModel({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );
    if (itemIndex > -1) {
      const newQuantity = cart.items[itemIndex].quantity + quantity;
      if (newQuantity > product.stock)
        return res
          .status(400)
          .json({ message: "Total quantity exceeds stock" });

      cart.items[itemIndex].quantity = newQuantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    const productsMap = new Map([[productId, product]]);
    calculateCartTotals(cart, productsMap);

    await cart.save();

    return res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const viewCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await cartModel.findOne({ user: userId }).populate({
      path: "items.product",
      select: "name price stock images",
    });

    if (!cart)
      return res.status(200).json({ message: "Cart is empty", cart: null });

    return res.status(200).json({ message: "Cart retrieved", cart });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const updateCartItemQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1)
      return res.status(400).json({ message: "Quantity must be at least 1" });

    const product = await productModel.findOne({
      _id: productId,
      isDeleted: false,
    });
    if (!product)
      return res.status(404).json({ message: "Product not found or inactive" });

    if (quantity > product.stock)
      return res
        .status(400)
        .json({ message: "Requested quantity exceeds stock" });

    const cart = await cartModel.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );
    if (itemIndex === -1)
      return res.status(404).json({ message: "Item not in cart" });

    cart.items[itemIndex].quantity = quantity;

    const productsMap = new Map([[productId, product]]);
    calculateCartTotals(cart, productsMap);

    await cart.save();

    return res.status(200).json({ message: "Cart item updated", cart });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const cart = await cartModel.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );
    if (itemIndex === -1)
      return res.status(404).json({ message: "Item not in cart" });

    cart.items.splice(itemIndex, 1);

    const productIds = cart.items.map((item) => item.product);
    const products = await productModel.find({ _id: { $in: productIds } });
    const productsMap = new Map(products.map((p) => [p._id.toString(), p]));

    calculateCartTotals(cart, productsMap);

    await cart.save();

    return res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await cartModel.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    cart.totalQuantity = 0;
    cart.totalPrice = 0;

    await cart.save();

    return res.status(200).json({ message: "Cart cleared", cart });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
