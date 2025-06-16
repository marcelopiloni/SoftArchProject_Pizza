const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, JWT_EXPIRATION } = require('../config/auth');

const setupDefaultAdmin = async () => {
  try {
    console.log('🔍 Verificando se admin padrão existe...');
    
    const adminEmail = 'admin@pizzaria.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('✅ Admin padrão já existe!');
      
      // Gerar token para o admin existente
      const token = jwt.sign(
        { 
          userId: existingAdmin._id, 
          email: existingAdmin.email, 
          role: existingAdmin.role 
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRATION }
      );
      
      console.log('🎉 DADOS DO ADMIN:');
      console.log('👤 Nome:', existingAdmin.name);
      console.log('📧 Email:', existingAdmin.email);
      console.log('🔑 Senha: admin123');
      console.log('🎭 Role:', existingAdmin.role);
      console.log('');
      console.log('🎫 TOKEN PARA SWAGGER:');
      console.log(token);
      console.log('');
      console.log('📋 COPIE E COLE NO SWAGGER (botão Authorize):');
      console.log('Bearer', token);
      console.log('═'.repeat(80));
      
      return existingAdmin;
    }
    
    console.log('🚀 Criando admin padrão...');
    
    // Dados do admin padrão
    const adminData = {
      name: 'Admin Pizzaria',
      email: adminEmail,
      password: await bcrypt.hash('admin123', 12),
      phone: '11999888777',
      role: 'admin'
    };
    
    const admin = await User.create(adminData);
    
    // Gerar token para o novo admin
    const token = jwt.sign(
      { 
        userId: admin._id, 
        email: admin.email, 
        role: admin.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );
    
    console.log('🎉 ADMIN CRIADO COM SUCESSO!');
    console.log('👤 Nome:', admin.name);
    console.log('📧 Email:', admin.email);
    console.log('🔑 Senha: admin123');
    console.log('🎭 Role:', admin.role);
    console.log('');
    console.log('🎫 TOKEN PARA SWAGGER:');
    console.log(token);
    console.log('');
    console.log('📋 COPIE E COLE NO SWAGGER (botão Authorize):');
    console.log('Bearer', token);
    console.log('💡 Use estes dados para fazer login ou usar o token diretamente!');
    console.log('═'.repeat(80));
    
    return admin;
    
  } catch (error) {
    console.error('❌ Erro ao criar admin padrão:', error.message);
    return null;
  }
};

const initializeApp = async () => {
  console.log('🍕 INICIALIZANDO ADMIN DA PIZZARIA...');
  console.log('═'.repeat(80));
  
  await setupDefaultAdmin();
  
  console.log('✅ INICIALIZAÇÃO CONCLUÍDA!');
  console.log('🌐 Acesse o Swagger: http://localhost:3000/api-docs');
  console.log('═'.repeat(80));
};

module.exports = {
  setupDefaultAdmin,
  initializeApp
};