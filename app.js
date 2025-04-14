const express = require('express');
const routes = require('./src/routes');
const connectToDatabase = require('./src/config/dbConnect');
require('dotenv').config();

const app = express();

// Middleware para parse de JSON
app.use(express.json());

// Conectar ao banco de dados
connectToDatabase()
  .then(() => console.log('Banco de dados conectado'))
  .catch(err => console.error('Erro na conexão com o banco de dados:', err));

// Rotas da API
app.use('/api', routes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

module.exports = app;