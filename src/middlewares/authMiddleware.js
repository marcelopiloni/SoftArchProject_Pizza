// Substitua o conteúdo por:
const authMiddleware = (req, res, next) => {
  // Sem verificação de JWT, apenas passa para o próximo middleware
  return next();
};

const adminMiddleware = (req, res, next) => {
  // Sem verificação de role, apenas passa para o próximo middleware
  return next();
};

module.exports = { authMiddleware, adminMiddleware };