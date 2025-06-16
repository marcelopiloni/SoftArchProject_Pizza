// ==========================================
// SWAGGER CONFIGURATION - Pizza Delivery API
// ==========================================

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '🍕 Pizza Delivery API',
      version: '1.0.0',
      description: `
        API completa para sistema de delivery de pizzas desenvolvida para apresentação acadêmica.
        
        **Funcionalidades:**
        - 🔐 Sistema de autenticação JWT
        - 👥 Gerenciamento de usuários (Admin/Cliente)
        - 🍕 CRUD completo de pizzas
        - 🛒 Sistema de pedidos
        - 🚚 Gerenciamento de entregas
        
        **Roles:**
        - **Admin**: Acesso total ao sistema
        - **Cliente**: Visualização de pizzas e gerenciamento dos próprios pedidos
        
        **Como usar:**
        1. Registre-se ou faça login
        2. Copie o token retornado
        3. Clique no botão "Authorize" e cole o token
        4. Teste os endpoints!
      `,
      contact: {
        name: 'Marcelo Piloni',
        email: 'marcelo.piloni@outlook.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor de Desenvolvimento'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Insira o token JWT no formato: Bearer {token}'
        }
      },
      schemas: {
        // USER SCHEMAS
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'João Silva' },
            email: { type: 'string', format: 'email', example: 'joao@email.com' },
            phone: { type: 'string', example: '(11) 99999-9999' },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' }
          }
        },
        UserRegister: {
          type: 'object',
          required: ['name', 'email', 'password', 'phone'],
          properties: {
            name: { type: 'string', minLength: 2, example: 'João Silva' },
            email: { type: 'string', format: 'email', example: 'joao@email.com' },
            password: { type: 'string', minLength: 6, example: '123456' },
            phone: { type: 'string', example: '11999999999' },
            role: { type: 'string', enum: ['user', 'admin'], default: 'user', example: 'user' }
          }
        },
        UserLogin: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'joao@email.com' },
            password: { type: 'string', example: '123456' }
          }
        },
        
        // PIZZA SCHEMAS
        Pizza: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'Margherita' },
            ingredients: { 
              type: 'array', 
              items: { type: 'string' },
              example: ['molho de tomate', 'mussarela', 'manjericão', 'azeite']
            },
            price: { type: 'number', format: 'float', example: 35.90 },
            category: { type: 'string', enum: ['Tradicional', 'Premium', 'Doce'], example: 'Tradicional' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        PizzaCreate: {
          type: 'object',
          required: ['name', 'ingredients', 'price', 'category'],
          properties: {
            name: { type: 'string', example: 'Margherita' },
            ingredients: { 
              type: 'array', 
              items: { type: 'string' },
              example: ['molho de tomate', 'mussarela', 'manjericão', 'azeite']
            },
            price: { type: 'number', format: 'float', minimum: 0, example: 35.90 },
            category: { type: 'string', enum: ['Tradicional', 'Premium', 'Doce'], example: 'Tradicional' }
          }
        },
        
        // ORDER SCHEMAS
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            user: { $ref: '#/components/schemas/User' },
            pizzas: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  pizza: { $ref: '#/components/schemas/Pizza' },
                  quantity: { type: 'integer', minimum: 1, example: 2 }
                }
              }
            },
            totalPrice: { type: 'number', format: 'float', example: 71.80 },
            status: { 
              type: 'string', 
              enum: ['Pendente', 'Em preparo', 'Em entrega', 'Entregue', 'Cancelado'],
              example: 'Pendente'
            },
            address: {
              type: 'object',
              properties: {
                street: { type: 'string', example: 'Rua das Flores' },
                number: { type: 'string', example: '123' },
                complement: { type: 'string', example: 'Apto 45' },
                neighborhood: { type: 'string', example: 'Centro' },
                city: { type: 'string', example: 'São Paulo' },
                zipCode: { type: 'string', example: '01234567' }
              }
            },
            paymentMethod: { 
              type: 'string', 
              enum: ['Dinheiro', 'Cartão de crédito', 'Cartão de débito', 'PIX'],
              example: 'PIX'
            },
            observations: { type: 'string', example: 'Sem cebola' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        OrderCreate: {
          type: 'object',
          required: ['user', 'pizzas', 'address', 'paymentMethod'],
          properties: {
            user: { type: 'string', example: '507f1f77bcf86cd799439011' },
            pizzas: {
              type: 'array',
              items: {
                type: 'object',
                required: ['pizza', 'quantity'],
                properties: {
                  pizza: { type: 'string', example: '507f1f77bcf86cd799439011' },
                  quantity: { type: 'integer', minimum: 1, example: 2 }
                }
              }
            },
            address: {
              type: 'object',
              required: ['street', 'number', 'neighborhood', 'city', 'zipCode'],
              properties: {
                street: { type: 'string', example: 'Rua das Flores' },
                number: { type: 'string', example: '123' },
                complement: { type: 'string', example: 'Apto 45' },
                neighborhood: { type: 'string', example: 'Centro' },
                city: { type: 'string', example: 'São Paulo' },
                zipCode: { type: 'string', pattern: '^[0-9]{8}$', example: '01234567' }
              }
            },
            paymentMethod: { 
              type: 'string', 
              enum: ['Dinheiro', 'Cartão de crédito', 'Cartão de débito', 'PIX'],
              example: 'PIX'
            },
            observations: { type: 'string', example: 'Sem cebola' }
          }
        },
        
        // DELIVERY SCHEMAS
        Delivery: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            order: { $ref: '#/components/schemas/Order' },
            deliveryPerson: { type: 'string', example: 'Carlos Motoqueiro' },
            startTime: { type: 'string', format: 'date-time' },
            endTime: { type: 'string', format: 'date-time' },
            status: { 
              type: 'string', 
              enum: ['Em preparo', 'Em rota', 'Entregue', 'Cancelado'],
              example: 'Em preparo'
            },
            estimatedTime: { type: 'integer', minimum: 1, example: 45 },
            notes: { type: 'string', example: 'Tocar interfone' }
          }
        },
        DeliveryCreate: {
          type: 'object',
          required: ['order', 'deliveryPerson', 'estimatedTime'],
          properties: {
            order: { type: 'string', example: '507f1f77bcf86cd799439011' },
            deliveryPerson: { type: 'string', example: 'Carlos Motoqueiro' },
            estimatedTime: { type: 'integer', minimum: 1, example: 45 },
            notes: { type: 'string', example: 'Tocar interfone' }
          }
        },
        
        // RESPONSE SCHEMAS
        AuthResponse: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/User' },
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Operação realizada com sucesso' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Erro na operação' }
          }
        },
        StatusUpdate: {
          type: 'object',
          required: ['status'],
          properties: {
            status: { type: 'string', example: 'Em preparo' }
          }
        }
      }
    },
    tags: [
      {
        name: '🔐 Authentication',
        description: 'Endpoints de autenticação e registro'
      },
      {
        name: '👥 Users',
        description: 'Gerenciamento de usuários (Admin only)'
      },
      {
        name: '🍕 Pizzas',
        description: 'CRUD de pizzas'
      },
      {
        name: '🛒 Orders',
        description: 'Gerenciamento de pedidos'
      },
      {
        name: '🚚 Deliveries',
        description: 'Gerenciamento de entregas (Admin only)'
      }
    ]
  },
  apis: ['./src/routes/*.js'], // Caminho para os arquivos de rotas
};

const specs = swaggerJsdoc(options);

// Customização do Swagger UI
const swaggerOptions = {
  customCss: `
    .swagger-ui .topbar { background-color: #E74C3C; }
    .swagger-ui .topbar .download-url-wrapper { display: none; }
    .swagger-ui .info .title { color: #E74C3C; }
    .swagger-ui .scheme-container { background: #F4D03F; padding: 15px; border-radius: 10px; }
    .swagger-ui .auth-wrapper { border: 2px solid #E74C3C; border-radius: 10px; }
  `,
  customSiteTitle: '🍕 Pizza Delivery API',
  customfavIcon: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/pizza_1f355.png'
};

module.exports = {
  specs,
  swaggerUi,
  swaggerOptions
};

// ==========================================
// DOCUMENTAÇÃO DAS ROTAS (para adicionar nos arquivos de rota)
// ==========================================

/**
 * ADICIONE ESTAS ANOTAÇÕES NOS SEUS ARQUIVOS DE ROTA:
 * 
 * Em userRoutes.js:
 * 
 * @swagger
 * /api/users/register:
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
 * 
 * @swagger
 * /api/users/login:
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
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Credenciais inválidas
 */