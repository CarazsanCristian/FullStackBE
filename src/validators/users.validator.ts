import Joi from "joi";

const userSchema: Joi.ObjectSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string()
    // .pattern(/^[ A-Za-z0-9_@./#&+-]*$/)
    .required(),
});

const userIdSchema: Joi.ObjectSchema = Joi.object({
  userId: Joi.number().required(),
});

export default {
  userSchema,
  userIdSchema,
};
