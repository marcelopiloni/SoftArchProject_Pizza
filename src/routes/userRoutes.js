const express = require('express');
const userController = require('../controllers/userController');

const routes = express.Router();

// Rotas sem autenticação
routes.post('/', userController.register);
routes.get('/', userController.getAllUsers);
routes.get('/:id', userController.getUser);
routes.put('/:id', userController.updateUser);
routes.delete('/:id', userController.deleteUser);

module.exports = routes;