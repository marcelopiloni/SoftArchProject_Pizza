const express = require('express');
const userController = require('../controllers/userController.js');
const { authMiddleware, adminMiddleware, optionalAuthMiddleware } = require('../middlewares/authMiddleware.js');
const validationMiddleware = require('../middlewares/validationMiddleware.js');
const userDto = require('../dtos/userDto.js');

const routes = express.Router();

// Rotas públicas
routes.post('/register', validationMiddleware(userDto.validateCreate), userController.register);
routes.post('/login', userController.login);

// Rotas com autenticação opcional (pode funcionar com ou sem token)
routes.get('/profile', optionalAuthMiddleware, userController.getProfile);

// Rotas protegidas - requer autenticação
routes.get('/:id', authMiddleware, userController.getUser);
routes.put('/:id', authMiddleware, validationMiddleware(userDto.validateUpdate), userController.updateUser);

// Rotas de admin - requer autenticação e role admin
routes.get('/', authMiddleware, adminMiddleware, userController.getAllUsers);
routes.delete('/:id', authMiddleware, adminMiddleware, userController.deleteUser);

module.exports = routes;