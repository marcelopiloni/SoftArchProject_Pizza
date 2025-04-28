import mongoose from "mongoose";

const pizzaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, 
    trim: true,
  },
  ingredients: [
    {
      type: String,
      trim: true,
    },
  ],
  price: {
    type: Number,
    required: true,
    min: 0, 
  },
  category: {
    type: String,
    enum: ["Tradicional", "Premium", "Doce"], // 3 CATEGORIAS DE PIZZA
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Pizza = mongoose.model("Pizza", pizzaSchema);

export default Pizza;
