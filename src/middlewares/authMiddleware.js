const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Verificar se o usuário está logado através da sessão
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Autenticação necessária' });
    }

    // Buscar usuário
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    // Adicionar usuário à requisição
    req.user = user;
    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Middleware para verificar se é admin
const adminMiddleware = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Acesso negado: permissão de administrador necessária' });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };