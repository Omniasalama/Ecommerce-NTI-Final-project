/** @format */
import Stripe from "stripe";
import orderModel from "../../database/model/order.Model.js";
import { productModel } from "../../database/model/productModel.js";
import envConfig from "../../../config/.env.service.js";

const stripe = new Stripe(envConfig.STRIPE_SECRET_KEY);

export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items, paymentMethod, shippingAddress } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: "Order items are required" });

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await productModel.findOne({
        _id: item.product,
        isDeleted: false,
      });

      if (!product)
        return res.status(404).json({ message: `Product not found` });

      if (item.quantity > product.stock)
        return res
          .status(400)
          .json({ message: `Insufficient stock for ${product.name}` });

      totalAmount += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    let paymentIntent = null;

    if (paymentMethod === "card") {
      paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalAmount * 100), 
        currency: "usd",
        automatic_payment_methods: { enabled: true },
      });
    }

    const order = await orderModel.create({
      user: userId,
      items: orderItems,
      totalAmount,
      paymentMethod,
      paymentStatus: "pending",
      stripePaymentIntentId: paymentIntent?.id,
      shippingAddress,
      status: "pending",
    });

    return res.status(201).json({
      message: "Order created successfully",
      order,
      clientSecret: paymentIntent?.client_secret || null,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  }
};


export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await orderModel
      .find({ user: userId })
      .populate("items.product");

    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching orders",
      error: error.message,
    });
  }
};


export const getOrderDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const order = await orderModel
      .findOne({ _id: id, user: userId })
      .populate("items.product");

    if (!order) return res.status(404).json({ message: "Order not found" });

    return res.status(200).json({ order });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching order",
      error: error.message,
    });
  }
};


export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find().populate("user items.product");

    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching all orders",
      error: error.message,
    });
  }
};


export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await orderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    return res.status(200).json({
      message: "Order status updated",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating order",
      error: error.message,
    });
  }
};


export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      envConfig.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object;

      await orderModel.findOneAndUpdate(
        { stripePaymentIntentId: intent.id },
        { paymentStatus: "paid", status: "processing" },
      );
    }

    if (event.type === "payment_intent.payment_failed") {
      const intent = event.data.object;

      await orderModel.findOneAndUpdate(
        { stripePaymentIntentId: intent.id },
        { paymentStatus: "failed" },
      );
    }

    res.json({ received: true });
  } catch (error) {
    res.status(500).json({
      message: "Webhook handling error",
      error: error.message,
    });
  }
};
