const BaseRepository = require('./baseRepository');
const Pizza = require('../models/Pizza');

class PizzaRepository extends BaseRepository {
  constructor() {
    super(Pizza);
  }

  async findAll() {
    return this.getAll();
  }

  async findById(id) {
    return this.getById(id);
  }

  async findByCategory(category) {
    return this.getAll({ category });
  }
}

module.exports = new PizzaRepository();