/** @format */
import bcrypt from "bcrypt";
import fs from "fs";
import jwt from "jsonwebtoken";
import { userModel } from "../../database/model/userModel.js";
import envConfig from "../../../config/.env.service.js";
import { generateTokens } from "../../common/utils/token.js";
import { sendEmail } from "../../common/email/sendEmail.js";

export const signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, phone } =
      req.body;
    const avatarPath = req.file ? req.file.path : "uploads/default-avatar.png";

    const existedUser = await userModel.findOne({ email });
    if (existedUser) {
      if (req.file) fs.unlinkSync(req.file.path); 
      return res.status(409).json({ message: "Email already registered" });
    }

    if (password !== confirmPassword) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const createdUser = await userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      avatar: avatarPath,
    });

    const verifyToken = jwt.sign(
      { _id: createdUser._id },
      envConfig.JWT_SECRET,
      { expiresIn: "1h" },
    );
    const verifyLink = `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${verifyToken}`;

    await sendEmail(
      email,
      "Verify Your Account",
      `<h1>Welcome!</h1><a href="${verifyLink}">Click here to verify your email</a>`,
    );

    return res.status(201).json({
      message: "Success. Please check your email to verify your account.",
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res
      .status(500)
      .json({ message: "Signup Error", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    if (!user.isVerified)
      return res
        .status(401)
        .json({ message: "Please verify your email first" });
    if (user.isDeleted)
      return res.status(403).json({ message: "Account is deleted" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const { accessToken, refreshToken } = generateTokens(user);
    console.log("GENERATED TOKEN:", accessToken);
    console.log("TOKEN LENGTH:", accessToken.length);
    return res.status(200).json({
      message: "Login successful",
      accessToken,
      role: user.role,
      user: { id: user._id, name: user.firstName },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Login Error", error: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, envConfig.JWT_SECRET);

    const user = await userModel.findOneAndUpdate(
      { _id: decoded._id, isVerified: false },
      { isVerified: true },
      { new: true },
    );

    if (!user)
      return res
        .status(400)
        .json({ message: "Invalid token or already verified" });

    return res
      .status(200)
      .json({ message: "Email verified! You can now login." });
  } catch (error) {
    return res.status(400).json({ message: "Token expired or invalid" });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isVerified) {
      return res
        .status(400)
        .json({ message: "This account is already verified. Please login." });
    }
    const verifyToken = jwt.sign({ _id: user._id }, envConfig.JWT_SECRET, {
      expiresIn: "1h",
    });
    const verifyLink = `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${verifyToken}`;
    await sendEmail(
      email,
      "Resend: Verify Your Account",
      `<h1>Email Verification</h1>
       <p>You requested a new verification link. Please click below:</p>
       <a href="${verifyLink}">Verify My Account</a>`,
    );

    return res.status(200).json({
      message: "A new verification link has been sent to your email.",
    });
  } catch (error) {
    console.error("Resend Error:", error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });

  const resetToken = jwt.sign({ _id: user._id }, envConfig.JWT_SECRET, {
    expiresIn: "15m",
  });
  const resetLink = `${req.protocol}://${req.get("host")}/api/v1/auth/reset-password/${resetToken}`;

  await sendEmail(
    email,
    "Reset Password",
    `<p>Click here to reset your password: ${resetLink}</p>`,
  );
  res.status(200).json({ message: "Reset link sent to your email." });
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const decoded = jwt.verify(token, envConfig.JWT_SECRET);

    const hashedPassword = await bcrypt.hash(password, 12);
    await userModel.findByIdAndUpdate(decoded._id, {
      password: hashedPassword,
      passwordChangedAt: Date.now(),
    });

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    res.status(400).json({ message: "Link expired or invalid" });
  }
};
