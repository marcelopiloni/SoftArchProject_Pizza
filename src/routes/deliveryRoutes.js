const express = require('express');
const deliveryController = require('../controllers/deliveryController');
// Remova esta linha:
// const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

const routes = express.Router();

// Rotas de Entregas - remover middlewares
routes.post('/', deliveryController.createDelivery);
routes.get('/', deliveryController.getAllDeliveries);
routes.get('/:id', deliveryController.getDelivery);
routes.get('/order/:orderId', deliveryController.getDeliveryByOrder);
routes.put('/:id', deliveryController.updateDelivery);
routes.patch('/:id/status', deliveryController.updateDeliveryStatus);
routes.delete('/:id', deliveryController.deleteDelivery);

module.exports = routes;