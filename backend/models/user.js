const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const fridgeItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true },
  unit: { type: String, required: true }
});


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferences: {
    dietaryRestrictions: [String],
    allergies: [String],
    favoriteRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }]
  },
  fridgeItems: [fridgeItemSchema],
  createdRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
  likedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }]
}, {
  timestamps: true
});


userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
