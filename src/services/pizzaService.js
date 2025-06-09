const pizzaRepository = require('../repositories/pizzaRepository.js');
const pizzaDto = require('../dtos/pizzaDto.js');

class PizzaService {
  async createPizza(pizzaData) {
    // Validar dados
    const { error } = pizzaDto.validateCreate(pizzaData);
    if (error) {
      throw new Error(error.details[0].message);
    }

    // Verificar se pizza com mesmo nome já existe
    const existingPizza = await pizzaRepository.getAll({ name: pizzaData.name });
    if (existingPizza.length > 0) {
      throw new Error('Pizza com este nome já existe');
    }

    const newPizza = await pizzaRepository.create(pizzaData);
    return newPizza;
  }

  async getPizzaById(id) {
    const pizza = await pizzaRepository.findById(id);
    if (!pizza) {
      throw new Error('Pizza não encontrada');
    }
    return pizza;
  }

  async updatePizza(id, pizzaData) {
    // Validar dados
    const { error } = pizzaDto.validateUpdate(pizzaData);
    if (error) {
      throw new Error(error.details[0].message);
    }

    // Verificar se pizza existe
    const existingPizza = await pizzaRepository.getById(id);
    if (!existingPizza) {
      throw new Error('Pizza não encontrada');
    }

    // Se está atualizando nome, verificar se não existe outra pizza com mesmo nome
    if (pizzaData.name) {
      const pizzaWithSameName = await pizzaRepository.getAll({ name: pizzaData.name });
      if (pizzaWithSameName.length > 0 && pizzaWithSameName[0]._id.toString() !== id) {
        throw new Error('Pizza com este nome já existe');
      }
    }

    const updatedPizza = await pizzaRepository.update(id, pizzaData);
    return updatedPizza;
  }

  async getAllPizzas() {
    return await pizzaRepository.findAll();
  }

  async getPizzasByCategory(category) {
    const validCategories = ['Tradicional', 'Premium', 'Doce'];
    if (!validCategories.includes(category)) {
      throw new Error(`Categoria inválida. Opções: ${validCategories.join(', ')}`);
    }
    
    return await pizzaRepository.findByCategory(category);
  }

  async deletePizza(id) {
    const deletedPizza = await pizzaRepository.delete(id);
    if (!deletedPizza) {
      throw new Error('Pizza não encontrada');
    }
    return { message: 'Pizza removida com sucesso' };
  }
}

module.exports = new PizzaService();