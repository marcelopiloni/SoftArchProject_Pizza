const express = require('express');
const orderController = require('../controllers/orderController.js');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware.js');
const validationMiddleware = require('../middlewares/validationMiddleware.js');
const orderDto = require('../dtos/orderDto.js');

const routes = express.Router();

// Todas as rotas de pedidos requerem autenticação
routes.use(authMiddleware);

// Rotas de usuário autenticado
routes.post('/', validationMiddleware(orderDto.validateCreate), orderController.createOrder);
routes.get('/user/:userId', orderController.getOrdersByUser);
routes.get('/:id', orderController.getOrder);

// Rotas que requerem admin (ver todos os pedidos e gerenciar status)
routes.get('/', adminMiddleware, orderController.getAllOrders);
routes.put('/:id', adminMiddleware, validationMiddleware(orderDto.validateUpdate), orderController.updateOrder);
routes.patch('/:id/status', adminMiddleware, orderController.updateOrderStatus);
routes.delete('/:id', adminMiddleware, orderController.deleteOrder);

module.exports = routes;