const pizzaRepository = require('../repositories/pizzaRepository');

class PizzaService {
  async createPizza(pizzaData) {
    if (!pizzaData.name || !pizzaData.price) {
      throw new Error("Nome e preço da pizza são obrigatórios.");
    }
    const newPizza = await pizzaRepository.create(pizzaData);
    return newPizza;
  }

  async getPizzaById(id) {
    const pizza = await pizzaRepository.findById(id);
    if (!pizza) {
      throw new Error("Pizza não encontrada.");
    }
    return pizza;
  }

  async updatePizza(id, pizzaData) {
    const updatedPizza = await pizzaRepository.update(id, pizzaData);
    if (!updatedPizza) {
      throw new Error("Pizza não encontrada para atualização.");
    }
    return updatedPizza;
  }

  async getAllPizzas() {
    const pizzas = await pizzaRepository.findAll();
    return pizzas;
  }

  async deletePizza(id) {
    const deletedPizza = await pizzaRepository.delete(id);
    if (!deletedPizza) {
      throw new Error("Pizza não encontrada para exclusão.");
    }
    return { message: "Pizza deletada com sucesso." };
  }
}

module.exports = new PizzaService();
