const BaseRepository = require('./baseRepository');
const Order = require('../models/Order');

class OrderRepository extends BaseRepository {
  constructor() {
    super(Order);
  }

  async findAll() {
    return this.getAll();
  }

  async findById(id) {
    return this.getById(id);
  }

  async findByUser(userId) {
    return this.getAll({ user: userId });
  }

  async findWithDetails(id) {
    return this.model.findById(id)
      .populate('user', '-password')
      .populate('pizzas.pizza');
  }

  async findAllWithDetails() {
    return this.model.find()
      .populate('user', '-password')
      .populate('pizzas.pizza');
  }

  async updateStatus(id, status) {
    return this.model.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );
  }
}

module.exports = new OrderRepository();