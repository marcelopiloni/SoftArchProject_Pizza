const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'pizza-delivery-secret-key';
const JWT_EXPIRATION = '24h';

module.exports = {
  JWT_SECRET,
  JWT_EXPIRATION
};