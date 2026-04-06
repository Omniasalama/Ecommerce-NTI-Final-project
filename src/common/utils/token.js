/** @format */
import jwt from "jsonwebtoken";
import envConfig from "../../../config/.env.service.js";

const SECRET = "MY_SUPER_SECRET_123";
export const generateTokens = (user) => {
  const payload = {
    _id: user._id,
    role: user.role,
    name: user.name,
  };

console.log("LOGIN SECRET:", envConfig.JWT_SECRET);
  return {
    accessToken: jwt.sign(payload, envConfig.JWT_SECRET, {
      expiresIn: envConfig.JWT_EXPIRE,
    }),

    refreshToken: jwt.sign(
      { _id: user._id },
      envConfig.JWT_SECRET,
      { expiresIn: "7d" }
    ),
  };
};