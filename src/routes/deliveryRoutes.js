const express = require('express');
const deliveryController = require('../controllers/deliveryController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

const routes = express.Router();

// Rotas de Entregas
routes.post('/', authMiddleware, adminMiddleware, deliveryController.createDelivery);
routes.get('/', authMiddleware, deliveryController.getAllDeliveries);
routes.get('/:id', authMiddleware, deliveryController.getDelivery);
routes.get('/order/:orderId', authMiddleware, deliveryController.getDeliveryByOrder);
routes.put('/:id', authMiddleware, adminMiddleware, deliveryController.updateDelivery);
routes.patch('/:id/status', authMiddleware, adminMiddleware, deliveryController.updateDeliveryStatus);
routes.delete('/:id', authMiddleware, adminMiddleware, deliveryController.deleteDelivery);

module.exports = routes;