import Joi from "joi";

const loginSchema: Joi.ObjectSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().required(),
  // .pattern(
  //   /(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[$@$!#.])[A-Za-zd$@$!%*?&.]{8,30}/
  // )
});

export default {
  loginSchema,
};
