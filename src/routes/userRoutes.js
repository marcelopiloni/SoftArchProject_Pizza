const express = require('express');
const userController = require('../controllers/userController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

const routes = express.Router();

// Rotas públicas (sem autenticação)
routes.post('/register', userController.register);
routes.post('/login', userController.login);

// Rotas protegidas (com autenticação)
routes.get('/profile', authMiddleware, userController.getProfile);
routes.get('/:id', authMiddleware, userController.getUser);
routes.put('/:id', authMiddleware, userController.updateUser);

// Rotas de admin
routes.get('/', authMiddleware, adminMiddleware, userController.getAllUsers);
routes.delete('/:id', authMiddleware, adminMiddleware, userController.deleteUser);

module.exports = routes;