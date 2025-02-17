const express = require('express');
const router = express.Router();
const vision = require('@google-cloud/vision');
const language = require('@google-cloud/language');
const config = require('../utils/googleCloud');

const visionClient = new vision.ImageAnnotatorClient(config);
const languageClient = new language.LanguageServiceClient(config);

// Common food categories and their related terms
const foodCategories = {
  dairy: ['milk', 'cheese', 'yogurt', 'cream', 'butter'],
  meat: ['chicken', 'beef', 'pork', 'fish', 'salmon', 'tuna'],
  produce: ['apple', 'banana', 'tomato', 'lettuce', 'carrot', 'potato'],
  grains: ['bread', 'rice', 'pasta', 'cereal', 'flour'],
  // Add more categories as needed
};

// Common abbreviations in receipts
const abbreviationMap = {
  'org': 'organic',
  'frsh': 'fresh',
  'nat': 'natural',
  'whl': 'whole',
  // Add more abbreviations as needed
};

router.post('/analyze-receipt', async (req, res) => {
  try {
    const { imageUrl } = req.body;

    // Perform OCR detection
    const [textResult] = await visionClient.textDetection(imageUrl);
    const fullText = textResult.textAnnotations[0]?.description || '';
    const textLines = fullText.split('\n');

    const ingredients = [];
    let currentItem = null;

    // Process lines
    for (let i = 0; i < textLines.length; i++) {
      const line = textLines[i].trim();
      
      // Skip header, special, and total lines
      if (line.match(/^(DATE|WED|\*+|SPECIAL|SUBTOTAL|TOTAL|LOYALTY|CASH|CHANGE|\$?\d+\.\d+)$/i)) {
        continue;
      }

      // Check for weight pattern in the next line
      const weightPattern = /^(\d+\.\d+)kg\s*NET\s*@\s*\$\d+\.\d+\/kg$/i;
      const nextLine = textLines[i + 1]?.trim() || '';
      const nextNextLine = textLines[i + 2]?.trim() || '';

      // If current line is an item name
      if (!line.match(/^\$?\d+/) && !line.match(weightPattern)) {
        currentItem = {
          name: line.replace(/\s+/g, ' ').trim(),
          quantity: '1',
          unit: 'piece'
        };

        // Check next lines for weight
        const weightMatch = nextNextLine.match(weightPattern);
        if (weightMatch) {
          currentItem.quantity = weightMatch[1];
          currentItem.unit = 'kg';
          i += 2; // Skip the price and weight lines
        }

        // Format name properly (capitalize first letter of each word)
        currentItem.name = currentItem.name
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        ingredients.push(currentItem);
      }
    }

    // Remove any duplicates
    const uniqueIngredients = ingredients.reduce((acc, current) => {
      const existing = acc.find(item => item.name.toLowerCase() === current.name.toLowerCase());
      if (!existing) {
        acc.push(current);
      } else if (current.unit === 'kg' && existing.unit === 'piece') {
        // Replace the piece entry with the kg entry
        const index = acc.indexOf(existing);
        acc[index] = current;
      }
      return acc;
    }, []);

    if (uniqueIngredients.length === 0) {
      res.status(404).json({ message: 'No ingredients detected in the receipt' });
    } else {
      res.json({ 
        ingredients: uniqueIngredients,
        rawText: fullText 
      });
    }

  } catch (error) {
    console.error('Vision API Error:', error);
    res.status(500).json({ error: 'Error analyzing receipt' });
  }
});

// Helper functions
function normalizeIngredientName(name) {
  // Remove special characters and extra spaces
  let normalized = name.replace(/[^\w\s]/g, ' ').trim();
  
  // Replace known abbreviations
  for (const [abbr, full] of Object.entries(abbreviationMap)) {
    const regex = new RegExp(`\\b${abbr}\\b`, 'gi');
    normalized = normalized.replace(regex, full);
  }

  return normalized;
}

function isValidFoodItem(name, entities) {
  // Check against Natural Language API entities
  const relevantEntity = entities.find(entity => 
    entity.name.toLowerCase().includes(name) &&
    ['CONSUMER_GOOD', 'FOOD_DRINK'].includes(entity.type)
  );

  if (relevantEntity && relevantEntity.salience > 0.3) {
    return true;
  }

  // Check against food categories
  for (const category of Object.values(foodCategories)) {
    if (category.some(term => name.includes(term))) {
      return true;
    }
  }

  return false;
}

module.exports = router;