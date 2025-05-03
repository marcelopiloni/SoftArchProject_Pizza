const express = require('express');
const orderController = require('../controllers/orderController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const routes = express.Router();

// Rotas de Pedidos
routes.post('/', authMiddleware, orderController.createOrder);
routes.get('/', authMiddleware, orderController.getAllOrders);
routes.get('/:id', authMiddleware, orderController.getOrder);
routes.get('/user/:userId', authMiddleware, orderController.getOrdersByUser);
routes.put('/:id', authMiddleware, orderController.updateOrder);
routes.patch('/:id/status', authMiddleware, orderController.updateOrderStatus);
routes.delete('/:id', authMiddleware, orderController.deleteOrder);

module.exports = routes;