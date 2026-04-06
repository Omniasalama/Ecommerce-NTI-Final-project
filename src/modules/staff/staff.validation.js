/** @format */

import Joi from "joi";

export const addStaffSchema = Joi.object({
  user: Joi.string().required().messages({
    "any.required": "User ID is required",
    "string.empty": "User ID cannot be empty",
  }),
  dailySalary: Joi.number().required().messages({
    "any.required": "Daily salary is required",
    "number.base": "Daily salary must be a number",
  }),
  department: Joi.string().required().messages({
    "any.required": "Department is required",
    "string.empty": "Department cannot be empty",
  }),
  joinDate: Joi.date().required().messages({
    "any.required": "Join date is required",
    "date.base": "Join date must be a valid date",
  }),
});
