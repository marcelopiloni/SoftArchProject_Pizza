const orderRepository = require('../repositories/orderRepository');
const pizzaRepository = require('../repositories/pizzaRepository');
const userRepository = require('../repositories/userRepository');
const orderDto = require('../dtos/orderDto');

class OrderService {
  async createOrder(orderData) {
    // Validar dados
    const { error } = orderDto.validateCreate(orderData);
    if (error) {
      throw new Error(error.details[0].message);
    }

    // Verificar se o usuário existe
    const user = await userRepository.getById(orderData.user);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Calcular preço total e verificar se as pizzas existem
    let totalPrice = 0;
    const pizzasPromises = orderData.pizzas.map(async (item) => {
      const pizza = await pizzaRepository.getById(item.pizza);
      if (!pizza) {
        throw new Error(`Pizza com ID ${item.pizza} não encontrada`);
      }
      totalPrice += pizza.price * item.quantity;
      return {
        ...item,
        pizza: item.pizza
      };
    });

    await Promise.all(pizzasPromises);

    // Criar pedido com preço total calculado
    const orderToCreate = {
      ...orderData,
      totalPrice
    };

    const newOrder = await orderRepository.create(orderToCreate);
    return await orderRepository.findWithDetails(newOrder._id);
  }

  async getOrderById(orderId) {
    const order = await orderRepository.findWithDetails(orderId);
    if (!order) {
      throw new Error('Pedido não encontrado');
    }
    return order;
  }

  async updateOrder(orderId, orderData) {
    // Validar dados
    const { error } = orderDto.validateUpdate(orderData);
    if (error) {
      throw new Error(error.details[0].message);
    }

    // Verificar se o pedido existe
    const order = await orderRepository.getById(orderId);
    if (!order) {
      throw new Error('Pedido não encontrado');
    }

    const updatedOrder = await orderRepository.update(orderId, orderData);
    return await orderRepository.findWithDetails(updatedOrder._id);
  }

  async getAllOrders() {
    return await orderRepository.findAllWithDetails();
  }

  async getOrdersByUser(userId) {
    // Verificar se o usuário existe
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const orders = await orderRepository.findByUser(userId);
    return orders;
  }

  async deleteOrder(orderId) {
    const order = await orderRepository.delete(orderId);
    if (!order) {
      throw new Error('Pedido não encontrado');
    }
    return { message: 'Pedido removido com sucesso' };
  }

  async updateOrderStatus(orderId, status) {
    const validStatuses = ['Pendente', 'Em preparo', 'Em entrega', 'Entregue', 'Cancelado'];
    
    if (!validStatuses.includes(status)) {
      throw new Error(`Status inválido. Opções válidas: ${validStatuses.join(', ')}`);
    }

    const order = await orderRepository.getById(orderId);
    if (!order) {
      throw new Error('Pedido não encontrado');
    }

    const updatedOrder = await orderRepository.updateStatus(orderId, status);
    return updatedOrder;
  }
}

module.exports = new OrderService();