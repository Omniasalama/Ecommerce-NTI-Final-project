/** @format */

import jwt from "jsonwebtoken";
import envConfig from "../../config/.env.service.js";

export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "Authorization required" });

  
  const token = authHeader.split(" ")[1]?.trim(); 
  console.log("RECEIVED TOKEN:", token);
  console.log("TOKEN LENGTH:", token.length);

  if (!token) return res.status(401).json({ message: "Token not provided" });

  try {
    const decoded = jwt.verify(token, envConfig.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid signature",
      error: error.message,
    });
  }
};

export const checkRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};
