const Joi = require('joi');

class UserDto {
  static validateCreate(data) {
    const schema = Joi.object({
      name: Joi.string().required().min(3).max(100),
      email: Joi.string().email().required(),
      password: Joi.string().required().min(6),
      phone: Joi.string().required().pattern(/^\d{10,11}$/)
    });

    return schema.validate(data);
  }

  static validateUpdate(data) {
    const schema = Joi.object({
      name: Joi.string().min(3).max(100),
      email: Joi.string().email(),
      password: Joi.string().min(6),
      phone: Joi.string().pattern(/^\d{10,11}$/)
    });

    return schema.validate(data);
  }

  static toResponse(user) {
    const userObj = user.toObject ? user.toObject() : {...user};
    delete userObj.password;
    return userObj;
  }
}

module.exports = UserDto;