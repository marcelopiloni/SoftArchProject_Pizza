const express = require('express');
const userController = require('../controllers/userController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rotas públicas
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

// Rotas protegidas para usuários
router.get('/profile', authMiddleware, userController.getCurrentUser);
router.put('/profile/:id', authMiddleware, userController.updateUser);

// Rotas administrativas
router.get('/', authMiddleware, adminMiddleware, userController.getAllUsers);
router.get('/:id', authMiddleware, adminMiddleware, userController.getUser);
router.delete('/:id', authMiddleware, adminMiddleware, userController.deleteUser);

module.exports = router;