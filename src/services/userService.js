const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const userDto = require('../dtos/userDto');
const { JWT_SECRET, JWT_EXPIRATION } = require('../config/auth');

class UserService {
  async registerUser(userData) {
    // Validar dados do usuário
    const { error } = userDto.validateCreate(userData);
    if (error) {
      throw new Error(error.details[0].message);
    }

    // Verificar se o e-mail já está em uso
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Criar o usuário com senha hash
    const newUser = await userRepository.create({
      ...userData,
      password: hashedPassword
    });

    // Retornar usuário sem a senha
    return userDto.toResponse(newUser);
  }

  async login(email, password) {
    // Verificar se o usuário existe
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Credenciais inválidas');
    }
  
    // Verificar se a senha está correta
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas');
    }
  
    // Retornar apenas o usuário sem o token
    return {
      user: userDto.toResponse(user)
    };
  }

  async getUserById(userId) {
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    return userDto.toResponse(user);
  }

  async updateUser(userId, userData) {
    // Validar dados de atualização
    const { error } = userDto.validateUpdate(userData);
    if (error) {
      throw new Error(error.details[0].message);
    }

    // Se estiver atualizando a senha, fazer o hash
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }

    // Atualizar usuário
    const updatedUser = await userRepository.update(userId, userData);
    if (!updatedUser) {
      throw new Error('Usuário não encontrado');
    }
    return userDto.toResponse(updatedUser);
  }

  async getAllUsers() {
    const users = await userRepository.getAll();
    return users.map(user => userDto.toResponse(user));
  }

  async deleteUser(userId) {
    const deletedUser = await userRepository.delete(userId);
    if (!deletedUser) {
      throw new Error('Usuário não encontrado');
    }
    return { message: 'Usuário removido com sucesso' };
  }
}

module.exports = new UserService();