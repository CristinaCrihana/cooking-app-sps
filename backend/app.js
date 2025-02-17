const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/recipes', require('./routes/recipeRoutes'));
app.use('/api/vision', require('./routes/visionRoutes'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;