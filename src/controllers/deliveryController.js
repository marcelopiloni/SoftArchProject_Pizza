const deliveryService = require('../services/deliveryService');

class DeliveryController {
  async createDelivery(req, res) {
    try {
      const deliveryData = req.body;
      const result = await deliveryService.createDelivery(deliveryData);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getDelivery(req, res) {
    try {
      const { id } = req.params;
      const delivery = await deliveryService.getDeliveryById(id);
      res.status(200).json(delivery);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async updateDelivery(req, res) {
    try {
      const { id } = req.params;
      const deliveryData = req.body;
      const updatedDelivery = await deliveryService.updateDelivery(id, deliveryData);
      res.status(200).json(updatedDelivery);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllDeliveries(req, res) {
    try {
      const deliveries = await deliveryService.getAllDeliveries();
      res.status(200).json(deliveries);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getDeliveryByOrder(req, res) {
    try {
      const { orderId } = req.params;
      const delivery = await deliveryService.getDeliveryByOrder(orderId);
      res.status(200).json(delivery);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async deleteDelivery(req, res) {
    try {
      const { id } = req.params;
      const result = await deliveryService.deleteDelivery(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async updateDeliveryStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: 'Status é obrigatório' });
      }
      
      const result = await deliveryService.updateDeliveryStatus(id, status);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new DeliveryController();