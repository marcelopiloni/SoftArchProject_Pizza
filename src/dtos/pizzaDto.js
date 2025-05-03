const Joi = require('joi');

class PizzaDto {
  static validateCreate(data) {
    const schema = Joi.object({
      name: Joi.string().required().min(3).max(100),
      ingredients: Joi.array().items(Joi.string()).min(1).required(),
      price: Joi.number().positive().required(),
      category: Joi.string().valid('Tradicional', 'Premium', 'Doce').required()
    });

    return schema.validate(data);
  }

  static validateUpdate(data) {
    const schema = Joi.object({
      name: Joi.string().min(3).max(100),
      ingredients: Joi.array().items(Joi.string()).min(1),
      price: Joi.number().positive(),
      category: Joi.string().valid('Tradicional', 'Premium', 'Doce')
    });

    return schema.validate(data);
  }
}

module.exports = PizzaDto;