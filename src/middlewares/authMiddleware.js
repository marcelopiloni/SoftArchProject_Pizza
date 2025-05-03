javascript// Middleware simplificado sem JWT
const authMiddleware = (req, res, next) => {
  // Sem verificação JWT, apenas passa adiante
  next();
};

const adminMiddleware = (req, res, next) => {
  // Sem verificação de roles, apenas passa adiante
  next();
};

module.exports = { authMiddleware, adminMiddleware };