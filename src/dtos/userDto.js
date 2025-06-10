const Joi = require('joi');

class UserDto {
  static validateCreate(data) {
    const schema = Joi.object({
      name: Joi.string().required().min(3).max(100),
      email: Joi.string().email().required(),
      password: Joi.string().required().min(6),
      phone: Joi.string().required().custom((value, helpers) => {
        // Remover caracteres não numéricos
        const cleanPhone = value.replace(/\D/g, '');
        
        // Verificar se tem 10 ou 11 dígitos
        if (cleanPhone.length < 10 || cleanPhone.length > 11) {
          return helpers.error('any.invalid');
        }
        
        return cleanPhone; // Retornar telefone limpo
      }, 'phone validation'),
      role: Joi.string().valid('user', 'admin').default('user')
    });

    return schema.validate(data);
  }

  static validateUpdate(data) {
    const schema = Joi.object({
      name: Joi.string().min(3).max(100),
      email: Joi.string().email(),
      password: Joi.string().min(6),
      phone: Joi.string().custom((value, helpers) => {
        // Remover caracteres não numéricos
        const cleanPhone = value.replace(/\D/g, '');
        
        // Verificar se tem 10 ou 11 dígitos
        if (cleanPhone.length < 10 || cleanPhone.length > 11) {
          return helpers.error('any.invalid');
        }
        
        return cleanPhone; // Retornar telefone limpo
      }, 'phone validation'),
      role: Joi.string().valid('user', 'admin')
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