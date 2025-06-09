const express = require('express');
const pizzaController = require('../controllers/pizzaController.js');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware.js');
const validationMiddleware = require('../middlewares/validationMiddleware.js');
const pizzaDto = require('../dtos/pizzaDto.js');

const routes = express.Router();

// Rotas públicas (qualquer um pode ver pizzas)
routes.get('/', pizzaController.getAllPizzas);
routes.get('/:id', pizzaController.getPizza);

// Rotas protegidas - apenas admin pode gerenciar pizzas
routes.post('/', authMiddleware, adminMiddleware, validationMiddleware(pizzaDto.validateCreate), pizzaController.createPizza);
routes.put('/:id', authMiddleware, adminMiddleware, validationMiddleware(pizzaDto.validateUpdate), pizzaController.updatePizza);
routes.delete('/:id', authMiddleware, adminMiddleware, pizzaController.deletePizza);

module.exports = routes;