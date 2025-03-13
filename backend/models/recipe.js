const mongoose = require('mongoose');
const reviewSchema = require('./review');

const nutritionSchema = new mongoose.Schema({
  calories: { type: Number },
  protein: { type: Number },
  carbohydrates: { type: Number },
  fat: { type: Number },
  fiber: { type: Number },
  sugar: { type: Number }
});

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: String, required: true },
  unit: { type: String, required: true },
  fdcId: { type: String },  // USDA Food Data Central ID
  nutritionPer100g: nutritionSchema,
  foodMeasures: [{
    //measureUnit: String,
    gramWeight: Number,
    disseminationText: String
  }]
});

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, default: 'C://Users//crist//Downloads//miniserole.jpg' },
  ingredients: [ingredientSchema],
  steps: [{
    description: { type: String, required: true }
  }],
  servings: { type: Number, required: true, min: 1 },
  cookingTime: { 
    type: Number,
    required: true,
    min: 1
  },
  
  cuisine: {
    type: String,
    required: true,
    enum: ['Italian', 'Mexican', 'Indian', 'Chinese', 'Japanese', 'Mediterranean', 'Other']
  },
  dietaryInfo: {
    isVegetarian: { type: Boolean, default: false },
    isVegan: { type: Boolean, default: false },
    isGlutenFree: { type: Boolean, default: false }
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  servings: { type: Number, default: 2 },
  reviews: [reviewSchema],
  totalNutrition: nutritionSchema
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