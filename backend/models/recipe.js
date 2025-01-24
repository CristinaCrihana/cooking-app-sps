const mongoose = require('mongoose');
const reviewSchema = require('./review');

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, default: 'C://Users//crist//Downloads//miniserole.jpg' },
  ingredients: [{
    name: { type: String, required: true },
    amount: { type: String, required: true },
    unit: { type: String, required: true }
  }],
  steps: [{
    description: { type: String, required: true }
  }],
  cookingTime: { 
    type: String, 
    required: true,
    enum: ['< 30 mins', '30-60 mins', '> 60 mins']
  },
  cuisine: {
    type: String,
    required: true,
    enum: ['Italian', 'Mexican', 'Indian', 'Chinese', 'Japanese', 'Mediterranean']
  },
  dietaryInfo: {
    isVegetarian: { type: Boolean, default: false },
    isVegan: { type: Boolean, default: false },
    isGlutenFree: { type: Boolean, default: false }
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  servings: { type: Number, default: 2 },
  reviews: [reviewSchema]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

recipeSchema.virtual('averageRating').get(function() {
  if (this.reviews.length === 0) return 0;
  const sum = this.reviews.reduce((total, review) => total + review.rating, 0);
  return (sum / this.reviews.length).toFixed(1);
});

recipeSchema.virtual('reviewCount').get(function() {
  return this.reviews.length;
});

module.exports = mongoose.model('Recipe', recipeSchema); 