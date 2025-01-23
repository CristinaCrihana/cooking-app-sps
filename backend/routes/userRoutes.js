const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

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

module.exports = router;
