const express = require('express');
const deliveryController = require('../controllers/deliveryController.js');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware.js');
const validationMiddleware = require('../middlewares/validationMiddleware.js');
const DeliveryDto = require('../dtos/deliveryDto.js');

const routes = express.Router();

// Todas as rotas de entrega requerem autenticação
routes.use(authMiddleware);

/**
 * @swagger
 * /deliveries/order/{orderId}:
 *   get:
 *     tags: [🚚 Deliveries]
 *     summary: Obter entrega por pedido
 *     description: Retorna a entrega associada a um pedido específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Entrega encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *       404:
 *         description: Entrega não encontrada para este pedido
 */
routes.get('/order/:orderId', deliveryController.getDeliveryByOrder);

/**
 * @swagger
 * /deliveries/{id}:
 *   get:
 *     tags: [🚚 Deliveries]
 *     summary: Obter entrega por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da entrega
 *     responses:
 *       200:
 *         description: Entrega encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *       404:
 *         description: Entrega não encontrada
 */
routes.get('/:id', deliveryController.getDelivery);

/**
 * @swagger
 * /deliveries:
 *   post:
 *     tags: [🚚 Deliveries]
 *     summary: Criar nova entrega (Admin)
 *     description: Cria uma nova entrega para um pedido
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeliveryCreate'
 *           example:
 *             order: "507f1f77bcf86cd799439011"
 *             deliveryPerson: "Carlos Motoqueiro"
 *             estimatedTime: 45
 *             notes: "Tocar interfone do apartamento 45"
 *     responses:
 *       201:
 *         description: Entrega criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *       400:
 *         description: Dados inválidos ou pedido já possui entrega
 *       403:
 *         description: Acesso negado - apenas administradores
 *       404:
 *         description: Pedido não encontrado
 */
routes.post('/', adminMiddleware, validationMiddleware(DeliveryDto.validateCreate), deliveryController.createDelivery);

/**
 * @swagger
 * /deliveries:
 *   get:
 *     tags: [🚚 Deliveries]
 *     summary: Listar todas as entregas (Admin)
 *     description: Retorna lista de todas as entregas do sistema
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de entregas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Delivery'
 *       403:
 *         description: Acesso negado - apenas administradores
 */
routes.get('/', adminMiddleware, deliveryController.getAllDeliveries);

/**
 * @swagger
 * /deliveries/{id}:
 *   put:
 *     tags: [🚚 Deliveries]
 *     summary: Atualizar entrega (Admin)
 *     description: Atualiza informações de uma entrega
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da entrega
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deliveryPerson:
 *                 type: string
 *                 example: "João Motoqueiro"
 *               estimatedTime:
 *                 type: integer
 *                 example: 30
 *               status:
 *                 type: string
 *                 enum: [Em preparo, Em rota, Entregue, Cancelado]
 *                 example: "Em rota"
 *               notes:
 *                 type: string
 *                 example: "Cliente solicitou entrega pela portaria"
 *     responses:
 *       200:
 *         description: Entrega atualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Entrega não encontrada
 *       403:
 *         description: Acesso negado
 */
routes.put('/:id', adminMiddleware, validationMiddleware(DeliveryDto.validateUpdate), deliveryController.updateDelivery);

/**
 * @swagger
 * /deliveries/{id}/status:
 *   patch:
 *     tags: [🚚 Deliveries]
 *     summary: Atualizar status da entrega (Admin)
 *     description: Atualiza apenas o status de uma entrega (também atualiza o pedido correspondente)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da entrega
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Em preparo, Em rota, Entregue, Cancelado]
 *                 example: "Entregue"
 *           example:
 *             status: "Entregue"
 *     responses:
 *       200:
 *         description: Status da entrega atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *       400:
 *         description: Status inválido
 *       404:
 *         description: Entrega não encontrada
 *       403:
 *         description: Acesso negado
 */
routes.patch('/:id/status', adminMiddleware, deliveryController.updateDeliveryStatus);

/**
 * @swagger
 * /deliveries/{id}:
 *   delete:
 *     tags: [🚚 Deliveries]
 *     summary: Excluir entrega (Admin)
 *     description: Remove uma entrega do sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da entrega
 *     responses:
 *       200:
 *         description: Entrega excluída
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Entrega não encontrada
 *       403:
 *         description: Acesso negado - apenas administradores
 */
routes.delete('/:id', adminMiddleware, deliveryController.deleteDelivery);

module.exports = routes;