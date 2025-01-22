import React from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

const RecipeIngredients = ({ ingredients, setRecipe, recipe }) => {
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [...ingredients, { name: '', amount: '', unit: '' }]
    });
  };

  return (
    <>
      <Typography variant="h6" sx={{ mt: 3 }}>Ingredients</Typography>
      {ingredients.map((ingredient, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="Ingredient"
            value={ingredient.name}
            onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
            required
          />
          <TextField
            label="Amount"
            value={ingredient.amount}
            onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
            required
          />
          <TextField
            label="Unit"
            value={ingredient.unit}
            onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
            required
          />
        </Box>
      ))}
      <Button onClick={addIngredient}>Add Ingredient</Button>
    </>
  );
};

export default RecipeIngredients; 