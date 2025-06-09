const express = require('express');
const cors = require('cors');
const routes = require('./src/routes.js');
const connectToDatabase = require('./src/config/dbConnect.js');
require('dotenv').config();

const app = express();

// Middleware CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Middleware para parse de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Conectar ao banco de dados
connectToDatabase()
  .then(() => console.log('Banco de dados conectado com sucesso'))
  .catch(err => {
    console.error('Erro na conexão com o banco de dados:', err);
    process.exit(1);
  });

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'API Pizza Delivery funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Rotas da API
app.use('/api', routes);

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Rota não encontrada',
    availableRoutes: [
      'GET /health',
      'POST /api/users/register',
      'POST /api/users/login',
      'GET /api/pizzas',
      'GET /api/orders',
      'GET /api/deliveries'
    ]
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro capturado:', err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'ID inválido' });
  }
  
  if (err.code === 11000) {
    return res.status(400).json({ message: 'Dados duplicados' });
  }
  
  res.status(500).json({ 
    message: 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

module.exports = app;