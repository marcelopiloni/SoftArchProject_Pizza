const express = require('express');
const path = require('path');
const routes = require('./src/routes/index');
const connectToDatabase = require('./src/config/dbConnect');
require('dotenv').config();

const app = express();

// Middleware CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Middleware para parse de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Conectar ao banco de dados
connectToDatabase()
  .then(() => console.log('✅ Banco de dados conectado com sucesso'))
  .catch(err => {
    console.error('❌ Erro na conexão com o banco de dados:', err);
    process.exit(1);
  });

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, 'public')));

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

// Rota para servir o frontend (SPA)
app.get('*', (req, res) => {
  // Se a rota não começar com /api, servir o index.html
  if (!req.url.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.status(404).json({ message: 'Rota da API não encontrada' });
  }
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