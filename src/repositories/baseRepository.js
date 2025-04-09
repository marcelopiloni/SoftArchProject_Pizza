class BaseRepository {
    constructor(model) {
      this.model = model;
    }
  
    async getAll(query = {}, options = {}) {
      return this.model.find(query, null, options);
    }
  
    async getById(id) {
      return this.model.findById(id);
    }
  
    async create(data) {
      return this.model.create(data);
    }
  
    async update(id, data) {
      return this.model.findByIdAndUpdate(id, data, { new: true });
    }
  
    async delete(id) {
      return this.model.findByIdAndDelete(id);
    }
  }
  
  module.exports = BaseRepository;