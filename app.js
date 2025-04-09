const express = require('express');
const routes = require('./src/routes');
require('./src/config/dbConnect');

const app = express();

// Middleware para parse de JSON
app.use(express.json());

// Rotas da API
app.use('/api', routes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

module.exports = app;