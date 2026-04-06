import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { userModel } from "./database/model/userModel.js";
import envConfig from "../config/.env.service.js"; 

const seedAdmin = async () => {
  try {
    const dbUri = "mongodb://127.0.0.1:27017/Ecommerce"; 
    console.log("Connecting to:", dbUri);
    await mongoose.connect(dbUri);
    const adminExists = await userModel.findOne({ email: "admin@ecommerce.com" });
    if (adminExists) {
      console.log("Admin already exists in the database.");
      process.exit();
    }
    const hashedPassword = await bcrypt.hash("Admin@12345", 12);
    await userModel.create({
      firstName: "System",
      lastName: "Admin",
      email: "admin@ecommerce.com",
      password: hashedPassword,
      phone: "0123456789",
      role: "admin",
      isVerified: true 
    });

    console.log("✅ Admin account seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedAdmin(); 