const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth'); 
const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, 'your_jwt_secret', { expiresIn: '30d' });
};

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });
    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get fridge items
router.get('/fridge', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.fridgeItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching fridge items', error: error.message });
  }
});

// Update fridge items
router.put('/fridge', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.fridgeItems = req.body;
    await user.save();
    res.json(user.fridgeItems);
  } catch (error) {
    res.status(500).json({ message: 'Error updating fridge items', error: error.message });
  }
});

// Get liked recipes
router.get('/liked-recipes', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('likedRecipes');
    res.json(user.likedRecipes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching liked recipes', error: error.message });
  }
});

// Add recipe to liked recipes
router.post('/liked-recipes/:recipeId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.likedRecipes.includes(req.params.recipeId)) {
      user.likedRecipes.push(req.params.recipeId);
      await user.save();
    }
    res.json({ message: 'Recipe added to liked recipes' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding recipe to liked recipes', error: error.message });
  }
});

// Remove recipe from liked recipes
router.delete('/liked-recipes/:recipeId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.likedRecipes = user.likedRecipes.filter(id => id.toString() !== req.params.recipeId);
    await user.save();
    res.json({ message: 'Recipe removed from liked recipes' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing recipe from liked recipes', error: error.message });
  }
});
router.get('/username', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ username: user.name });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching username', error: error.message });
  }
});
module.exports = router;
