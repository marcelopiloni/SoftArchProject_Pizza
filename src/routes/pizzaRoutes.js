const express = require('express');
const pizzaController = require('../controllers/pizzaController');

const routes = express.Router();

// Rotas de Pizzas
routes.post('/', pizzaController.createPizza);
routes.get('/', pizzaController.getAllPizzas);
routes.get('/:id', pizzaController.getPizza);
routes.put('/:id', pizzaController.updatePizza);
routes.delete('/:id', pizzaController.deletePizza);

module.exports = routes;
