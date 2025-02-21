const express = require('express');
const router = express.Router();
const vision = require('@google-cloud/vision');
const config = require('../utils/googleCloud');

const visionClient = new vision.ImageAnnotatorClient(config);

// Food categories to filter out non-food items
const foodCategories = {
  dairy: ['milk', 'cheese', 'yogurt', 'cream', 'butter'],
  meat: ['chicken', 'beef', 'pork', 'fish', 'salmon', 'tuna'],
  produce: ['apple', 'banana', 'tomato', 'lettuce', 'carrot', 'potato', 'lime', 'pepper'],
  grains: ['bread', 'rice', 'pasta', 'cereal', 'flour'],
};

// Abbreviations for cleaning up names
const abbreviationMap = {
  'org': 'organic',
  'frsh': 'fresh',
  'nat': 'natural',
  'whl': 'whole',
};

// Normalize ingredient names
function normalizeIngredientName(name) {
  name = name.toLowerCase().replace(/[^\w\s]/g, ' ').trim(); // Remove special chars

  for (const [abbr, full] of Object.entries(abbreviationMap)) {
    name = name.replace(new RegExp(`\\b${abbr}\\b`, 'gi'), full);
  }

  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' '); // Capitalize words
}

// Checks if the item is a valid food ingredient
function isValidFoodItem(name) {
  return Object.values(foodCategories).some(category =>
    category.some(term => name.toLowerCase().includes(term))
  );
}

router.post('/analyze-receipt', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const [textResult] = await visionClient.textDetection(imageUrl);
    const fullText = textResult.textAnnotations[0]?.description || '';
    const textLines = fullText.split('\n');

    console.log("Full OCR Text:", fullText);

    const ingredients = [];
    
    // Updated patterns for better quantity detection
    const countPattern = /(\d+)\s*(?:@\s*[\d.]+|x\s*[\d.]+|\$[\d.]+|EA)/i; // Matches "3 @ 0.58", "3 x 1.99", "3 EA", "3 $1.99"
    const weightPattern = /([\d.]+)\s*(lb|kg|oz|g)\b\s*(?:@\s*\$?[\d.]+\/\2)?/i; // Matches "1.14 lb", "1.14 lb @ 2.49/lb"

    for (let i = 0; i < textLines.length; i++) {
      let line = textLines[i].trim();
      
      // Skip total/tax lines
      if (line.match(/^(Order Total|Sales Tax|Grand Total|Credit|Payment|Change|\d+\.\d+\s*F)$/i)) {
        continue;
      }

      // Look for item lines (now checking current line for quantities too)
      if (!line.match(/^\$?\d+\.\d+$/)) { // Skip price-only lines
        let currentItem = {
          name: '',
          quantity: '1',
          unit: 'piece'
        };

        // First check if quantity is in the current line
        const lineQuantityMatch = line.match(countPattern);
        const lineWeightMatch = line.match(weightPattern);

        if (lineQuantityMatch || lineWeightMatch) {
          // Extract name by removing the quantity part
          const quantityPart = lineQuantityMatch?.[0] || lineWeightMatch?.[0];
          currentItem.name = normalizeIngredientName(line.replace(quantityPart, ''));
          
          if (lineQuantityMatch) {
            currentItem.quantity = lineQuantityMatch[1];
            currentItem.unit = 'piece';
          } else {
            currentItem.quantity = lineWeightMatch[1];
            currentItem.unit = lineWeightMatch[2].toLowerCase();
          }
        } else {
          // Check adjacent lines if no quantity in current line
          currentItem.name = normalizeIngredientName(line);
          
          // Look ahead up to 2 lines for quantity
          for (let j = 1; j <= 2; j++) {
            const nextLine = textLines[i + j]?.trim() || '';
            const quantityMatch = nextLine.match(countPattern);
            const weightMatch = nextLine.match(weightPattern);

            if (quantityMatch) {
              currentItem.quantity = quantityMatch[1];
              currentItem.unit = 'piece';
              i += j; // Skip the processed quantity line
              break;
            } else if (weightMatch) {
              currentItem.quantity = weightMatch[1];
              currentItem.unit = weightMatch[2].toLowerCase();
              i += j;
              break;
            }
          }
        }

        console.log(`Processed item:`, currentItem);
        ingredients.push(currentItem);
      }
    }

    // Remove duplicates & merge quantities
    const uniqueIngredients = [];
    for (const item of ingredients) {
      const existing = uniqueIngredients.find(i => i.name.toLowerCase() === item.name.toLowerCase());

      if (existing) {
        if (item.unit === existing.unit) {
          existing.quantity = (parseFloat(existing.quantity) + parseFloat(item.quantity)).toString();
        }
      } else {
        uniqueIngredients.push(item);
      }
    }

    // Filter out non-food items
    const filteredIngredients = uniqueIngredients.filter(item => isValidFoodItem(item.name));

    if (filteredIngredients.length === 0) {
      res.status(404).json({ message: 'No valid ingredients detected in the receipt' });
    } else {
      res.json({ ingredients: filteredIngredients, rawText: fullText });
    }
  } catch (error) {
    console.error('Vision API Error:', error);
    res.status(500).json({ error: 'Error analyzing receipt' });
  }
});

module.exports = router;
