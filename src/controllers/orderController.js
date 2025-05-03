const orderService = require('../services/orderService');

class OrderController {
  async createOrder(req, res) {
    try {
      const orderData = req.body;
      const result = await orderService.createOrder(orderData);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getOrder(req, res) {
    try {
      const { id } = req.params;
      const order = await orderService.getOrderById(id);
      res.status(200).json(order);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async updateOrder(req, res) {
    try {
      const { id } = req.params;
      const orderData = req.body;
      const updatedOrder = await orderService.updateOrder(id, orderData);
      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllOrders(req, res) {
    try {
      const orders = await orderService.getAllOrders();
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getOrdersByUser(req, res) {
    try {
      const { userId } = req.params;
      const orders = await orderService.getOrdersByUser(userId);
      res.status(200).json(orders);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async deleteOrder(req, res) {
    try {
      const { id } = req.params;
      const result = await orderService.deleteOrder(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: 'Status é obrigatório' });
      }
      
      const result = await orderService.updateOrderStatus(id, status);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new OrderController();