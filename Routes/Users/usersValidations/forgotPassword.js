const Joi = require("joi");

const forgotPasswordSchema = Joi.object({
  email: Joi.string().min(8).max(255).email().required().trim(),
});

const resetpasswordSchema = Joi.object({
  /* password must contain at least one lowercase letter, one uppercase letter, one digit, and minimum 8 characters */
  /* allows special characters */
  password: Joi.string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/)
    .required(),
});

const validate = (schema, userInput) => {
  return schema.validateAsync(userInput, { abortEarly: false });
};

const validateForgotPassword = (userInput) => {
  return validate(forgotPasswordSchema, userInput);
};

const validateResetPassword = (userInput) => {
  return validate(resetpasswordSchema, userInput);
};

module.exports = { validateForgotPassword, validateResetPassword };
