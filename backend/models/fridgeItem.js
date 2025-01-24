const mongoose = require('mongoose');

const fridgeItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true },
  unit: { type: String, required: true }
});

module.exports = fridgeItemSchema;