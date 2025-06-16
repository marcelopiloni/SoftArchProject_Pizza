const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository.js');
const userDto = require('../dtos/userDto.js');
const { JWT_SECRET, JWT_EXPIRATION } = require('../config/auth.js');

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

    // Criptografar a senha
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Criar o usuário com senha criptografada
    const newUser = await userRepository.create({
      ...userData,
      password: hashedPassword
    });

    // Gerar token JWT
    const token = jwt.sign(
      { 
        userId: newUser._id, 
        email: newUser.email, 
        role: newUser.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    return {
      user: userDto.toResponse(newUser),
      token
    };
  }

  async login(email, password) {
    // Verificar se o usuário existe
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Credenciais inválidas');
    }

    // Gerar token JWT
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    return {
      user: userDto.toResponse(user),
      token
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

    // Se está atualizando senha, criptografar
    if (userData.password) {
      const saltRounds = 12;
      userData.password = await bcrypt.hash(userData.password, saltRounds);
    }

    // Verificar se email já existe (se estiver sendo atualizado)
    if (userData.email) {
      const existingUser = await userRepository.findByEmail(userData.email);
      if (existingUser && existingUser._id.toString() !== userId) {
        throw new Error('Email já está em uso');
      }
    }

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