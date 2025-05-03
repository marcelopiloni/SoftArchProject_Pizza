const express = require('express');
const userController = require('../controllers/userController');
// Remova esta linha: const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

const routes = express.Router();

// Rotas sem autenticação
routes.post('/register', userController.register);
routes.post('/login', userController.login);

// Remova os middlewares authMiddleware
routes.get('/profile', userController.getProfile);
routes.get('/:id', userController.getUser);
routes.put('/:id', userController.updateUser);

// Remova os middlewares adminMiddleware
routes.get('/', userController.getAllUsers);
routes.delete('/:id', userController.deleteUser);

module.exports = routes;