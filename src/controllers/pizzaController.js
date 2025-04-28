const pizzaService = require('../services/pizzaService');

class PizzaController {
  async createPizza(req, res) {
    try {
      const pizzaData = req.body;
      const result = await pizzaService.createPizza(pizzaData);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getPizza(req, res) {
    try {
      const { id } = req.params;
      const pizza = await pizzaService.getPizzaById(id);
      res.status(200).json(pizza);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async updatePizza(req, res) {
    try {
      const { id } = req.params;
      const pizzaData = req.body;
      const updatedPizza = await pizzaService.updatePizza(id, pizzaData);
      res.status(200).json(updatedPizza);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllPizzas(req, res) {
    try {
      const pizzas = await pizzaService.getAllPizzas();
      res.status(200).json(pizzas);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deletePizza(req, res) {
    try {
      const { id } = req.params;
      const result = await pizzaService.deletePizza(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

module.exports = new PizzaController();
