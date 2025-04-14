const userRepository = require('../repositories/userRepository');

class UserService {
  async registerUser(userData) {
    const { email } = userData;
    
    // Verificar se o usuário já existe
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email já cadastrado');
    }
    
    // Criar novo usuário
    const user = await userRepository.create(userData);
    
    // Retornar dados do usuário (sem senha)
    const userResponse = user.toObject();
    delete userResponse.password;
    
    return userResponse;
  }
  
  async getUserById(userId) {
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    
    const userResponse = user.toObject();
    delete userResponse.password;
    
    return userResponse;
  }
  
  async updateUser(userId, userData) {
    const user = await userRepository.update(userId, userData);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    
    const userResponse = user.toObject();
    delete userResponse.password;
    
    return userResponse;
  }
  
  async getAllUsers() {
    const users = await userRepository.getAll();
    
    return users.map(user => {
      const userObj = user.toObject();
      delete userObj.password;
      return userObj;
    });
  }
  
  async deleteUser(userId) {
    const user = await userRepository.delete(userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    
    return { message: 'Usuário removido com sucesso' };
  }
}

module.exports = new UserService();