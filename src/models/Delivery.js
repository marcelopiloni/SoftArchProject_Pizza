const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    unique: true
  },
  deliveryPerson: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Em preparo', 'Em rota', 'Entregue', 'Cancelado'],
    default: 'Em preparo'
  },
  estimatedTime: {
    type: Number,  // Tempo estimado em minutos
    required: true,
    min: 1
  },
  notes: {
    type: String
  }
}, { versionKey: false });

module.exports = mongoose.model('Delivery', deliverySchema);