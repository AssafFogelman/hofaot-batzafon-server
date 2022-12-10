const Joi = require("joi");
const { min } = require("lodash");

function validateCard(card) {
  const schema = Joi.object({
    performanceTitle: Joi.string().min(2).max(256).required(),
    subTitle: Joi.string().min(2).max(256).required(),
    description: Joi.string().min(2).max(1024).required(),
    // wazeLocation: Joi.string().min(2).max(1024),
    performanceDate: Joi.string().min(2).required(),
    //bizName: Joi.string().min(2).max(256).required(),
    // phone: Joi.string().min(9).max(32),
    // bizUrl: Joi.string().min(2),
    //I don't think I need all these fields that come from the user itself and not from the input.
    url: Joi.string().min(6).max(1024),
    alt: Joi.string().min(2).max(256),
  });
  return schema.validate(card);
}

exports.validateCard = validateCard;
