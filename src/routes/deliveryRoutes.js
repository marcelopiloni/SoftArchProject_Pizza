const express = require('express');
const deliveryController = require('../controllers/deliveryController.js');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware.js');
const validationMiddleware = require('../middlewares/validationMiddleware.js');
const deliveryDto = require('../dtos/deliveryDto.js');

const routes = express.Router();

// Todas as rotas de entrega requerem autenticação
routes.use(authMiddleware);

// Rotas de usuário autenticado (pode ver entregas de seus pedidos)
routes.get('/order/:orderId', deliveryController.getDeliveryByOrder);
routes.get('/:id', deliveryController.getDelivery);

// Rotas que requerem admin (gerenciar todas as entregas)
routes.post('/', adminMiddleware, validationMiddleware(deliveryDto.validateCreate), deliveryController.createDelivery);
routes.get('/', adminMiddleware, deliveryController.getAllDeliveries);
routes.put('/:id', adminMiddleware, validationMiddleware(deliveryDto.validateUpdate), deliveryController.updateDelivery);
routes.patch('/:id/status', adminMiddleware, deliveryController.updateDeliveryStatus);
routes.delete('/:id', adminMiddleware, deliveryController.deleteDelivery);

module.exports = routes;