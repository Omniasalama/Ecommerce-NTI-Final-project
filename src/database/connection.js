/** @format */

import mongoose from "mongoose";
import envConfig from "./../../config/.env.service.js";

export const databaseConnection = async () => {
  try {
    if (!envConfig.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is undefined. Check your .env file location.",
      );
    }

    await mongoose.connect(envConfig.MONGODB_URI);
    console.log("✅ Database Connected Successfully");
  } catch (err) {
    console.error("❌ Database Connection Failed:", err.message);
  }
};
