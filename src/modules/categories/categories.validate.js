/** @format */
import Joi from "joi";
export const createCategorySchema = Joi.object({
  name: Joi.string().min(3).max(20).required().trim(),
  description: Joi.string().min(3).max(100).required().trim(),
});
export const updateCategorySchema = Joi.object({
  name: Joi.string().min(3).max(20).trim(),
  description: Joi.string().min(3).max(100).trim(),
}).min(1);

export const validateCreateCategory = (req, res, next) => {
  const { error } = createCategorySchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res
      .status(400)
      .json({ message: "Validation Error", errors: errorMessages });
  }

  next();
};

export const validateUpdateCategory = (req, res, next) => {
  const { error } = updateCategorySchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res
      .status(400)
      .json({ message: "Validation Error", errors: errorMessages });
  }

  next();
};
