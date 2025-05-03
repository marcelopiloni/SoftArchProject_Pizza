const BaseRepository = require('./baseRepository');
const Delivery = require('../models/Delivery');

class DeliveryRepository extends BaseRepository {
  constructor() {
    super(Delivery);
  }

  async findAll() {
    return this.getAll();
  }

  async findById(id) {
    return this.getById(id);
  }

  async findByOrder(orderId) {
    return this.model.findOne({ order: orderId });
  }

  async findWithOrderDetails(id) {
    return this.model.findById(id)
      .populate({
        path: 'order',
        populate: [
          { path: 'user', select: '-password' },
          { path: 'pizzas.pizza' }
        ]
      });
  }

  async findAllWithOrderDetails() {
    return this.model.find()
      .populate({
        path: 'order',
        populate: [
          { path: 'user', select: '-password' },
          { path: 'pizzas.pizza' }
        ]
      });
  }

  async updateStatus(id, status) {
    const updates = { status };
    
    if (status === 'Entregue') {
      updates.endTime = new Date();
    }
    
    return this.model.findByIdAndUpdate(
      id, 
      updates, 
      { new: true }
    );
  }
}

module.exports = new DeliveryRepository();