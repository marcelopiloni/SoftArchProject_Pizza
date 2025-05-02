const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  pizzas: [
    {
      pizza: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pizza',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
      }
    }
  ],
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['Pendente', 'Em preparo', 'Em entrega', 'Entregue', 'Cancelado'],
    default: 'Pendente'
  },
  address: {
    street: { type: String, required: true },
    number: { type: String, required: true },
    complement: { type: String },
    neighborhood: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    enum: ['Dinheiro', 'Cartão de crédito', 'Cartão de débito', 'PIX'],
    required: true
  },
  observations: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { versionKey: false });

module.exports = mongoose.model('Order', orderSchema);