const express = require('express');
const path = require('path');
const routes = require('./src/routes/index');
const connectToDatabase = require('./src/config/dbConnect');
const { specs, swaggerUi, swaggerOptions } = require('./src/config/swagger');

// ✨ NOVA IMPORTAÇÃO
const { initializeApp } = require('./src/utils/setupAdmin');

require('dotenv').config();

const app = express();

// Middleware CORS (manter o existente)
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

// Middleware para parse de JSON (manter o existente)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ✨ CONECTAR AO BANCO E INICIALIZAR ADMIN
connectToDatabase()
  .then(async () => {
    console.log('✅ Banco de dados conectado com sucesso');
    
    // ✨ CHAMAR INICIALIZAÇÃO AUTOMÁTICA (SÓ ADMIN)
    await initializeApp();
  })
  .catch(err => {
    console.error('❌ Erro na conexão com o banco de dados:', err);
    process.exit(1);
  });

// Servir arquivos estáticos do frontend (manter o existente)
app.use(express.static(path.join(__dirname, 'public')));

// Swagger Documentation (manter o existente)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

// Health check (manter o existente)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'API Pizza Delivery funcionando!',
    timestamp: new Date().toISOString(),
    documentation: 'http://localhost:3000/api-docs',
    adminCredentials: {
      email: 'admin@pizzaria.com',
      password: 'admin123'
    }
  });
});

// Rotas da API (manter o existente)
app.use('/api', routes);

// Rota para servir o frontend (manter o existente)
app.get('*', (req, res) => {
  if (!req.url.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.status(404).json({ message: 'Rota da API não encontrada' });
  }
});

// Middleware de tratamento de erros (manter o existente)
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