import React, { useState } from 'react';
import { 
  Paper, 
  Typography, 
  Button, 
  List, 
  ListItem, 
  ListItemText,
  Box 
} from '@mui/material';
import { convert, standardizeUnit } from '../utils/unitConverter';

const ShoppingList = ({ fridgeItems, likedRecipes }) => {
  const [shoppingList, setShoppingList] = useState([]);

  const generateShoppingList = () => {
    // Create a map of fridge items for easy lookup
    const fridgeMap = new Map(
      fridgeItems.map(item => [
        item.name.toLowerCase(),
        { amount: parseFloat(item.quantity), unit: standardizeUnit(item.unit) }
      ])
    );

    // Collect all ingredients from liked recipes
    const neededIngredients = new Map();

    likedRecipes.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => {
        const name = ingredient.name.toLowerCase();
        const amount = parseFloat(ingredient.amount);
        const unit = standardizeUnit(ingredient.unit);

        if (neededIngredients.has(name)) {
          const existing = neededIngredients.get(name);
          if (existing.unit === unit) {
            existing.amount += amount;
          } else {
            try {
              const convertedAmount = convert(amount, unit, existing.unit);
              existing.amount += convertedAmount;
            } catch (error) {
              console.warn(`Couldn't convert units for ${name}`);
            }
          }
        } else {
          neededIngredients.set(name, { amount, unit });
        }
      });
    });

    // Calculate shopping list by subtracting fridge items
    const shoppingItems = [];

    neededIngredients.forEach((needed, name) => {
      const fridgeItem = fridgeMap.get(name);
      
      if (!fridgeItem) {
        // If item is not in fridge, add full amount to shopping list
        shoppingItems.push({
          name,
          quantity: needed.amount.toFixed(2),
          unit: needed.unit
        });
      } else {
        try {
          // Convert fridge amount to needed unit
          const convertedFridgeAmount = convert(
            fridgeItem.amount,
            fridgeItem.unit,
            needed.unit
          );

          if (convertedFridgeAmount < needed.amount) {
            // If we don't have enough, add the difference
            shoppingItems.push({
              name,
              quantity: (needed.amount - convertedFridgeAmount).toFixed(2),
              unit: needed.unit
            });
          }
        } catch (error) {
          console.warn(`Couldn't convert units for ${name}`);
        }
      }
    });

    setShoppingList(shoppingItems);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Shopping List
        </Typography>
        <Button 
          variant="contained" 
          onClick={generateShoppingList}
        >
          Generate Shopping List
        </Button>
      </Box>

      {shoppingList.length > 0 ? (
        <List>
          {shoppingList.map((item, index) => (
            <ListItem key={index} divider>
              <ListItemText
                primary={item.name}
                secondary={`${item.quantity} ${item.unit}`}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Click the button above to generate your shopping list
        </Typography>
      )}
    </Paper>
  );
};

export default ShoppingList; 