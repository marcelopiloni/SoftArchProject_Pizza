const express = require('express');
const orderController = require('../controllers/orderController');
// Remova esta linha:
// const { authMiddleware } = require('../middlewares/authMiddleware');

const routes = express.Router();

// Rotas de Pedidos - remover middleware
routes.post('/', orderController.createOrder);
routes.get('/', orderController.getAllOrders);
routes.get('/:id', orderController.getOrder);
routes.get('/user/:userId', orderController.getOrdersByUser);
routes.put('/:id', orderController.updateOrder);
routes.patch('/:id/status', orderController.updateOrderStatus);
routes.delete('/:id', orderController.deleteOrder);

module.exports = routes;