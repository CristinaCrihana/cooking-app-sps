const express = require('express');
const Recipe = require('../models/recipe');
const auth = require('../middleware/auth'); 

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const recipe = new Recipe({
      ...req.body,
      author: req.user._id 
    });

    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    res.status(400).json({ message: 'Error creating recipe', error: error.message });
  }
});

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

router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('reviews.user', 'name');
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipe' });
  }
});

router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const review = {
      user: req.user._id,
      rating: req.body.rating,
      comment: req.body.comment
    };

    recipe.reviews.push(review);
    await recipe.save();

    const updatedRecipe = await Recipe.findById(recipe._id)
      .populate('reviews.user', 'name');

    res.json(updatedRecipe);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(400).json({ message: 'Error adding review' });
  }
});
router.put('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this recipe' });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedRecipe);
  } catch (error) {
    res.status(400).json({ message: 'Error updating recipe', error: error.message });
  }
});

// Delete recipe
router.delete('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this recipe' });
    }

    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting recipe', error: error.message });
  }
});

// Get user's recipes
router.get('/user/my-recipes', auth, async (req, res) => {
  try {
    const recipes = await Recipe.find({ author: req.user._id })
      .sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipes', error: error.message });
  }
});

module.exports = router; 