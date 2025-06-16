const express = require('express');
const pizzaController = require('../controllers/pizzaController.js');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware.js');
const validationMiddleware = require('../middlewares/validationMiddleware.js');
const PizzaDto = require('../dtos/pizzaDto.js');

const routes = express.Router();

/**
 * @swagger
 * /pizzas:
 *   get:
 *     tags: [🍕 Pizzas]
 *     summary: Listar todas as pizzas
 *     description: Retorna lista de todas as pizzas disponíveis (público)
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Tradicional, Premium, Doce]
 *         description: Filtrar por categoria
 *     responses:
 *       200:
 *         description: Lista de pizzas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pizza'
 */
routes.get('/', pizzaController.getAllPizzas);

/**
 * @swagger
 * /pizzas/{id}:
 *   get:
 *     tags: [🍕 Pizzas]
 *     summary: Obter pizza por ID
 *     description: Retorna detalhes de uma pizza específica (público)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da pizza
 *     responses:
 *       200:
 *         description: Pizza encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pizza'
 *       404:
 *         description: Pizza não encontrada
 */
routes.get('/:id', pizzaController.getPizza);

/**
 * @swagger
 * /pizzas:
 *   post:
 *     tags: [🍕 Pizzas]
 *     summary: Criar nova pizza (Admin)
 *     description: Adiciona uma nova pizza ao cardápio
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PizzaCreate'
 *           example:
 *             name: "Margherita"
 *             ingredients: ["molho de tomate", "mussarela", "manjericão", "azeite"]
 *             price: 35.90
 *             category: "Tradicional"
 *     responses:
 *       201:
 *         description: Pizza criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pizza'
 *       400:
 *         description: Dados inválidos
 *       403:
 *         description: Acesso negado - apenas administradores
 */
routes.post('/', authMiddleware, adminMiddleware, validationMiddleware(PizzaDto.validateCreate), pizzaController.createPizza);

/**
 * @swagger
 * /pizzas/{id}:
 *   put:
 *     tags: [🍕 Pizzas]
 *     summary: Atualizar pizza (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da pizza
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Margherita Premium"
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["molho de tomate", "mussarela de búfala", "manjericão", "azeite extra virgem"]
 *               price:
 *                 type: number
 *                 example: 42.90
 *               category:
 *                 type: string
 *                 example: "Premium"
 *     responses:
 *       200:
 *         description: Pizza atualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pizza'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Pizza não encontrada
 *       403:
 *         description: Acesso negado
 */
routes.put('/:id', authMiddleware, adminMiddleware, validationMiddleware(PizzaDto.validateUpdate), pizzaController.updatePizza);

/**
 * @swagger
 * /pizzas/{id}:
 *   delete:
 *     tags: [🍕 Pizzas]
 *     summary: Excluir pizza (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da pizza
 *     responses:
 *       200:
 *         description: Pizza excluída
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Pizza não encontrada
 *       403:
 *         description: Acesso negado
 */
routes.delete('/:id', authMiddleware, adminMiddleware, pizzaController.deletePizza);

module.exports = routes;