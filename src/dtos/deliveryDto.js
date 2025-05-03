const Joi = require('joi');

class DeliveryDto {
  static validateCreate(data) {
    const schema = Joi.object({
      order: Joi.string().hex().length(24).required(),
      deliveryPerson: Joi.string().required(),
      estimatedTime: Joi.number().integer().positive().required(),
      notes: Joi.string().allow('')
    });

    return schema.validate(data);
  }

  static validateUpdate(data) {
    const schema = Joi.object({
      deliveryPerson: Joi.string(),
      status: Joi.string().valid('Em preparo', 'Em rota', 'Entregue', 'Cancelado'),
      endTime: Joi.date(),
      estimatedTime: Joi.number().integer().positive(),
      notes: Joi.string().allow('')
    });

    return schema.validate(data);
  }
}

module.exports = DeliveryDto;