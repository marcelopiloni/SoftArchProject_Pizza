const Joi = require('joi');

class OrderDto {
  static validateCreate(data) {
    const schema = Joi.object({
      user: Joi.string().hex().length(24).required(),
      pizzas: Joi.array().items(
        Joi.object({
          pizza: Joi.string().hex().length(24).required(),
          quantity: Joi.number().integer().positive().default(1)
        })
      ).min(1).required(),
      address: Joi.object({
        street: Joi.string().required(),
        number: Joi.string().required(),
        complement: Joi.string().allow(''),
        neighborhood: Joi.string().required(),
        city: Joi.string().required(),
        zipCode: Joi.string().pattern(/^\d{8}$/).required()
      }).required(),
      paymentMethod: Joi.string().valid('Dinheiro', 'Cartão de crédito', 'Cartão de débito', 'PIX').required(),
      observations: Joi.string().allow('')
    });

    return schema.validate(data);
  }

  static validateUpdate(data) {
    const schema = Joi.object({
      status: Joi.string().valid('Pendente', 'Em preparo', 'Em entrega', 'Entregue', 'Cancelado'),
      address: Joi.object({
        street: Joi.string(),
        number: Joi.string(),
        complement: Joi.string().allow(''),
        neighborhood: Joi.string(),
        city: Joi.string(),
        zipCode: Joi.string().pattern(/^\d{8}$/)
      }),
      paymentMethod: Joi.string().valid('Dinheiro', 'Cartão de crédito', 'Cartão de débito', 'PIX'),
      observations: Joi.string().allow('')
    });

    return schema.validate(data);
  }
}

module.exports = OrderDto;