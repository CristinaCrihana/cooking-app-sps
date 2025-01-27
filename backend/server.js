const mongoose = require('mongoose');
const app = require('./app');

mongoose.connect('mongodb+srv://bunnytina:Luminara78@cooking-app.y3xtb.mongodb.net/Cooking?retryWrites=true&w=majority&appName=cooking-app')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));