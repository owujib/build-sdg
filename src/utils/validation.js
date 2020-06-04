import Joi from '@hapi/joi';

//register Validation
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100),
    profile_img: Joi.string().required(),
    passwordConfirm: Joi.ref('password'),
    role: Joi.string().valid('admin', 'user'),
    user_type: Joi.string().required().valid('farmer', 'customer'),
    delivery_address: Joi.string().required()
  });
  // console.log(schema.validate(data));
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100),
    passwordConfirm: Joi.ref('password')
  });

  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
