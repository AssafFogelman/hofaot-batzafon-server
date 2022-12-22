const Joi = require("joi");

const forgotPasswordSchema = Joi.object({
  email: Joi.string().min(8).max(255).email().required().trim(),
});

const validate = (schema, userInput) => {
  return schema.validateAsync(userInput, { abortEarly: false });
};

const validateForgotPassword = (userInput) => {
  return validate(forgotPasswordSchema, userInput);
};

module.exports = { validateForgotPassword };
