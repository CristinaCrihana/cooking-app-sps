const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();


app.use(bodyParser.json());
app.use(cors());


mongoose.connect('mongodb+srv://bunnytina:Luminara78@cooking-app.y3xtb.mongodb.net/Cooking?retryWrites=true&w=majority&appName=cooking-app')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));


app.use('/api/users', require('../src/routes/userRoutes'));
app.use('/api/recipes', require('../src/routes/recipeRoutes'));


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
