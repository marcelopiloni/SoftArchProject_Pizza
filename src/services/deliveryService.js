const deliveryRepository = require('../repositories/deliveryRepository');
const orderRepository = require('../repositories/orderRepository');
const deliveryDto = require('../dtos/deliveryDto');

class DeliveryService {
  async createDelivery(deliveryData) {
    // Validar dados
    const { error } = deliveryDto.validateCreate(deliveryData);
    if (error) {
      throw new Error(error.details[0].message);
    }

    // Verificar se o pedido existe
    const order = await orderRepository.getById(deliveryData.order);
    if (!order) {
      throw new Error('Pedido não encontrado');
    }

    // Verificar se o pedido já está em entrega
    const existingDelivery = await deliveryRepository.findByOrder(deliveryData.order);
    if (existingDelivery) {
      throw new Error('Este pedido já possui uma entrega associada');
    }

    // Atualizar status do pedido para "Em preparo"
    await orderRepository.updateStatus(deliveryData.order, 'Em preparo');

    // Criar entrega
    const newDelivery = await deliveryRepository.create(deliveryData);
    return await deliveryRepository.findWithOrderDetails(newDelivery._id);
  }

  async getDeliveryById(deliveryId) {
    const delivery = await deliveryRepository.findWithOrderDetails(deliveryId);
    if (!delivery) {
      throw new Error('Entrega não encontrada');
    }
    return delivery;
  }

  async updateDelivery(deliveryId, deliveryData) {
    // Validar dados
    const { error } = deliveryDto.validateUpdate(deliveryData);
    if (error) {
      throw new Error(error.details[0].message);
    }

    // Verificar se a entrega existe
    const delivery = await deliveryRepository.getById(deliveryId);
    if (!delivery) {
      throw new Error('Entrega não encontrada');
    }

    // Se está atualizando para status "Entregue", atualiza também o pedido
    if (deliveryData.status === 'Entregue') {
      await orderRepository.updateStatus(delivery.order, 'Entregue');
      deliveryData.endTime = new Date();
    } else if (deliveryData.status === 'Em rota') {
      await orderRepository.updateStatus(delivery.order, 'Em entrega');
    } else if (deliveryData.status === 'Cancelado') {
      await orderRepository.updateStatus(delivery.order, 'Cancelado');
    }

    const updatedDelivery = await deliveryRepository.update(deliveryId, deliveryData);
    return await deliveryRepository.findWithOrderDetails(updatedDelivery._id);
  }

  async getAllDeliveries() {
    return await deliveryRepository.findAllWithOrderDetails();
  }

  async getDeliveryByOrder(orderId) {
    const delivery = await deliveryRepository.findByOrder(orderId);
    if (!delivery) {
      throw new Error('Entrega não encontrada para este pedido');
    }
    return await deliveryRepository.findWithOrderDetails(delivery._id);
  }

  async deleteDelivery(deliveryId) {
    const delivery = await deliveryRepository.delete(deliveryId);
    if (!delivery) {
      throw new Error('Entrega não encontrada');
    }
    return { message: 'Entrega removida com sucesso' };
  }

  async updateDeliveryStatus(deliveryId, status) {
    const validStatuses = ['Em preparo', 'Em rota', 'Entregue', 'Cancelado'];
    
    if (!validStatuses.includes(status)) {
      throw new Error(`Status inválido. Opções válidas: ${validStatuses.join(', ')}`);
    }

    const delivery = await deliveryRepository.getById(deliveryId);
    if (!delivery) {
      throw new Error('Entrega não encontrada');
    }

    // Atualizar status do pedido correspondente
    if (status === 'Em rota') {
      await orderRepository.updateStatus(delivery.order, 'Em entrega');
    } else if (status === 'Entregue') {
      await orderRepository.updateStatus(delivery.order, 'Entregue');
    } else if (status === 'Cancelado') {
      await orderRepository.updateStatus(delivery.order, 'Cancelado');
    }

    const updatedDelivery = await deliveryRepository.updateStatus(deliveryId, status);
    return updatedDelivery;
  }
}

module.exports = new DeliveryService();