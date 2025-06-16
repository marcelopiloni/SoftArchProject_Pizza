const express = require('express');
const orderController = require('../controllers/orderController.js');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware.js');
const validationMiddleware = require('../middlewares/validationMiddleware.js');
const OrderDto = require('../dtos/orderDto.js');

const routes = express.Router();

// Todas as rotas de pedidos requerem autenticação
routes.use(authMiddleware);

/**
 * @swagger
 * /orders:
 *   post:
 *     tags: [🛒 Orders]
 *     summary: Criar novo pedido
 *     description: Cria um novo pedido de pizza
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderCreate'
 *           example:
 *             user: "507f1f77bcf86cd799439011"
 *             pizzas:
 *               - pizza: "507f1f77bcf86cd799439012"
 *                 quantity: 2
 *               - pizza: "507f1f77bcf86cd799439013"
 *                 quantity: 1
 *             address:
 *               street: "Rua das Flores"
 *               number: "123"
 *               complement: "Apto 45"
 *               neighborhood: "Centro"
 *               city: "São Paulo"
 *               zipCode: "01234567"
 *             paymentMethod: "PIX"
 *             observations: "Sem cebola"
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Dados inválidos
 */
routes.post('/', validationMiddleware(OrderDto.validateCreate), orderController.createOrder);

/**
 * @swagger
 * /orders/user/{userId}:
 *   get:
 *     tags: [🛒 Orders]
 *     summary: Obter pedidos por usuário
 *     description: Retorna todos os pedidos de um usuário específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Lista de pedidos do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       404:
 *         description: Usuário não encontrado
 */
routes.get('/user/:userId', orderController.getOrdersByUser);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     tags: [🛒 Orders]
 *     summary: Obter pedido por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Pedido não encontrado
 */
routes.get('/:id', orderController.getOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     tags: [🛒 Orders]
 *     summary: Listar todos os pedidos (Admin)
 *     description: Retorna lista de todos os pedidos do sistema
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       403:
 *         description: Acesso negado - apenas administradores
 */
routes.get('/', adminMiddleware, orderController.getAllOrders);

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     tags: [🛒 Orders]
 *     summary: Atualizar pedido (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pendente, Em preparo, Em entrega, Entregue, Cancelado]
 *               observations:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pedido atualizado
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Pedido não encontrado
 */
routes.put('/:id', adminMiddleware, validationMiddleware(OrderDto.validateUpdate), orderController.updateOrder);

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     tags: [🛒 Orders]
 *     summary: Atualizar status do pedido (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StatusUpdate'
 *           example:
 *             status: "Em preparo"
 *     responses:
 *       200:
 *         description: Status atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Status inválido
 *       404:
 *         description: Pedido não encontrado
 */
routes.patch('/:id/status', adminMiddleware, orderController.updateOrderStatus);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     tags: [🛒 Orders]
 *     summary: Excluir pedido (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido excluído
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Pedido não encontrado
 */
routes.delete('/:id', adminMiddleware, orderController.deleteOrder);

module.exports = routes;