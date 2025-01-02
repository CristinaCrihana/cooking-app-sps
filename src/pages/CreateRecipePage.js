import React, { useState } from 'react';
import { TextField, Button, Checkbox, FormControlLabel, Paper, Typography, Box } from '@mui/material';

const CreateRecipePage = () => {
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    image: '',
    ingredients: [{ name: '', amount: '', unit: '' }],
    steps: [{ description: '' }],
    dietaryInfo: {
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false
    }
  });

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index][field] = value;
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, { name: '', amount: '', unit: '' }]
    });
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...recipe.steps];
    newSteps[index].description = value;
    setRecipe({ ...recipe, steps: newSteps });
  };

  const addStep = () => {
    setRecipe({
      ...recipe,
      steps: [...recipe.steps, { description: '' }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Sending recipe data:', recipe);

      const token = localStorage.getItem('token');
      console.log('Token:', token);

      const response = await fetch('http://localhost:5000/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(recipe)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error response:', errorData);
        alert(`Failed to create recipe: ${errorData.message}`);
        return;
      }

      const data = await response.json();
      alert('Recipe created successfully!');
    } catch (error) {
      console.error('Error creating recipe:', error);
      alert('Error creating recipe');
    }
  };

  return (
    <Paper sx={{ maxWidth: 800, margin: 'auto', p: 3, mt: 3 }}>
      <Typography variant="h4" gutterBottom>Create New Recipe</Typography>
      
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Recipe Title"
          value={recipe.title}
          onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Description"
          value={recipe.description}
          onChange={(e) => setRecipe({ ...recipe, description: e.target.value })}
          margin="normal"
          multiline
          rows={3}
          required
        />

        <TextField
          fullWidth
          label="Image URL"
          value={recipe.image}
          onChange={(e) => setRecipe({ ...recipe, image: e.target.value })}
          margin="normal"
          required
        />

        <Typography variant="h6" sx={{ mt: 3 }}>Ingredients</Typography>
        {recipe.ingredients.map((ingredient, index) => (
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

        <Typography variant="h6" sx={{ mt: 3 }}>Steps</Typography>
        {recipe.steps.map((step, index) => (
          <TextField
            key={index}
            fullWidth
            label={`Step ${index + 1}`}
            value={step.description}
            onChange={(e) => handleStepChange(index, e.target.value)}
            margin="normal"
            multiline
            required
          />
        ))}
        <Button onClick={addStep}>Add Step</Button>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Dietary Information</Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={recipe.dietaryInfo.isVegetarian}
                onChange={(e) => setRecipe({
                  ...recipe,
                  dietaryInfo: { ...recipe.dietaryInfo, isVegetarian: e.target.checked }
                })}
              />
            }
            label="Vegetarian"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={recipe.dietaryInfo.isVegan}
                onChange={(e) => setRecipe({
                  ...recipe,
                  dietaryInfo: { ...recipe.dietaryInfo, isVegan: e.target.checked }
                })}
              />
            }
            label="Vegan"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={recipe.dietaryInfo.isGlutenFree}
                onChange={(e) => setRecipe({
                  ...recipe,
                  dietaryInfo: { ...recipe.dietaryInfo, isGlutenFree: e.target.checked }
                })}
              />
            }
            label="Gluten Free"
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          fullWidth
        >
          Create Recipe
        </Button>
      </form>
    </Paper>
  );
};

export default CreateRecipePage; 