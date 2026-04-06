/** @format */

import Joi from "joi";

export const signupSchema = Joi.object({
  firstName: Joi.string().required().min(2).max(20),
  lastName: Joi.string().required().min(2).max(20),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  phone: Joi.string().required(),
}).required();

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(8).max(30).required().messages({
    "string.min": "Password must be at least 8 characters long",
    "any.required": "Password is required",
  }),
});
