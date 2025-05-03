const express = require('express');
const userRoutes = require('./userRoutes');
const pizzaRoutes = require('./pizzaRoutes');
const orderRoutes = require('./orderRoutes');
const deliveryRoutes = require('./deliveryRoutes');

const routes = express.Router();

routes.use('/users', userRoutes);
routes.use('/pizzas', pizzaRoutes);
routes.use('/orders', orderRoutes);
routes.use('/deliveries', deliveryRoutes);

module.exports = routes;