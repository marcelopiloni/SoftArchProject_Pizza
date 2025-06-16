const express = require('express');
const userController = require('../controllers/userController.js');
const { authMiddleware, adminMiddleware, optionalAuthMiddleware } = require('../middlewares/authMiddleware.js');
const validationMiddleware = require('../middlewares/validationMiddleware.js');
const UserDto = require('../dtos/userDto.js');

const routes = express.Router();

/**
 * @swagger
 * /users/register:
 *   post:
 *     tags: [🔐 Authentication]
 *     summary: Registrar novo usuário
 *     description: Cria uma nova conta de usuário no sistema
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *           example:
 *             name: "João Silva"
 *             email: "joao@email.com"
 *             password: "123456"
 *             phone: "11999999999"
 *             role: "user"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
routes.post('/register', validationMiddleware(UserDto.validateCreate), userController.register);

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags: [🔐 Authentication]
 *     summary: Fazer login
 *     description: Autentica o usuário e retorna token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *           example:
 *             email: "admin@pizzaria.com"
 *             password: "admin123"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
routes.post('/login', userController.login);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     tags: [🔐 Authentication]
 *     summary: Obter perfil do usuário
 *     description: Retorna informações do perfil do usuário logado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Token inválido
 *       404:
 *         description: Usuário não encontrado
 */
routes.get('/profile', optionalAuthMiddleware, userController.getProfile);

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [👥 Users]
 *     summary: Listar todos os usuários (Admin)
 *     description: Retorna lista de todos os usuários cadastrados
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       403:
 *         description: Acesso negado - apenas administradores
 */
routes.get('/', authMiddleware, adminMiddleware, userController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [👥 Users]
 *     summary: Obter usuário por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 */
routes.get('/:id', authMiddleware, userController.getUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags: [👥 Users]
 *     summary: Atualizar usuário
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "João Silva Atualizado"
 *               email:
 *                 type: string
 *                 example: "joao.novo@email.com"
 *               phone:
 *                 type: string
 *                 example: "11888777666"
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Usuário não encontrado
 */
routes.put('/:id', authMiddleware, validationMiddleware(UserDto.validateUpdate), userController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags: [👥 Users]
 *     summary: Excluir usuário (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário excluído
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Usuário não encontrado
 *       403:
 *         description: Acesso negado
 */
routes.delete('/:id', authMiddleware, adminMiddleware, userController.deleteUser);

module.exports = routes;