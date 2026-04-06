/** @format */

import nodemailer from "nodemailer";
import envConfig from "../../../config/.env.service.js";

export const sendEmail = async (email, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", 
    auth: {
      user: envConfig.SMTP_USER,
      pass: envConfig.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Ecommerce Support" <${envConfig.SMTP_USER}>`,
    to: email,
    subject,
    html,
  });
};
