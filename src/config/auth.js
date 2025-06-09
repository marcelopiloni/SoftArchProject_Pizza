const crypto = require('crypto');

module.exports = {
    JWT_SECRET: process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex'),
    JWT_EXPIRATION: process.env.JWT_EXPIRES_IN || '24h'
};