import Joi from "joi";

const category = {
  category: Joi.object().keys({
    name: Joi.string()
      .trim()
      .pattern(/^[a-zA-Z ]*$/)
      .required()
      .messages({
        "string.base": `name should be a type of string`,
        "string.empty": `name cannot be an empty field`,
        "string.pattern.base": `name should only contain alphapet or space`,
        "any.required": `name is a required field`,
      }),
  }),
};

export default category;
