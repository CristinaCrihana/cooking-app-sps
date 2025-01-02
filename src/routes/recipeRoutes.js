const express = require('express');
const Recipe = require('../models/recipe');
const auth = require('../middleware/auth'); // You'll need to create this middleware

const router = express.Router();

// Create a new recipe
router.post('/', auth, async (req, res) => {
  try {
    const recipe = new Recipe({
      ...req.body,
      author: req.user._id // This comes from the auth middleware
    });

    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    res.status(400).json({ message: 'Error creating recipe', error: error.message });
  }
});

// Get all recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipes', error: error.message });
  }
});

// Get single recipe
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipe', error: error.message });
  }
});

module.exports = router; 