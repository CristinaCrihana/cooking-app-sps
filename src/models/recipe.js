const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  ingredients: [{
    name: { type: String, required: true },
    amount: { type: String, required: true },
    unit: { type: String, required: true }
  }],
  steps: [{
    description: { type: String, required: true }
  }],
  dietaryInfo: {
    isVegetarian: { type: Boolean, default: false },
    isVegan: { type: Boolean, default: false },
    isGlutenFree: { type: Boolean, default: false }
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  servings: { type: Number, default: 2 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Recipe', recipeSchema); 