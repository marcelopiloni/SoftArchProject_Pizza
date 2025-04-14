const authMiddleware = (req, res, next) => {
  // Sem verificação de autenticação, apenas prossegue
  next();
};

const adminMiddleware = (req, res, next) => {
  // Sem verificação de admin, apenas prossegue
  next();
};

module.exports = { authMiddleware, adminMiddleware };