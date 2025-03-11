const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const app = express();
const redisClient = require('./utils/redis');

app.use(bodyParser.json());
app.use(cors());

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/recipes', require('./routes/recipeRoutes'));
app.use('/api/vision', require('./routes/visionRoutes'));
app.use('/api/usda', require('./routes/usdaRoutes'));

redisClient.on('connect', () => {
  console.log('Connected to Redis!');
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Add error handler for Redis
process.on('SIGINT', async () => {
  await redisClient.quit();
  process.exit();
});

module.exports = app;