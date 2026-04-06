/** @format */

import express from "express";
import { databaseConnection } from "./database/connection.js";
import envConfig from "../config/.env.service.js";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/user/user.controller.js";
import categoriesRouter from "./modules/categories/categories.controller.js";
import subCategoriesRouter from "./modules/subcategories/subcategoreis.controller.js";
import productRoutes from "./modules/products/products.controller.js";
import cartRouter from "./modules/cart/cart.controller.js";
import orderRouter from "./modules/order/order.controller.js";
import staffRouter from "./modules/staff/staff.controller.js";
import attendanceRouter from "./modules/attending/attending.controller.js";
import deductionRouter from "./modules/deduction/deduction.controller.js";
import salaryRouter from "./modules/salary/salary.controller.js";
export const bootstrap = () => {
  const app = express();
  const port = envConfig.PORT;
  app.use(express.json());
  databaseConnection();
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/categories", categoriesRouter);
  app.use("/api/v1/subcategories", subCategoriesRouter);
  app.use("/api/v1/products", productRoutes);
  app.use("/api/v1/cart", cartRouter);
  app.use("/api/v1/orders", orderRouter);
  app.use("/api/v1/staff", staffRouter);
  app.use("/api/v1/attendance", attendanceRouter);
  app.use("/api/v1/deduction", deductionRouter);
  app.use("/api/v1/salary", salaryRouter);

  app.listen(3000, () => {
    console.log(`Server is running on port ${port}`);
  });
};
