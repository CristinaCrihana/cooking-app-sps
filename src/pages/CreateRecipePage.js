import React, { useState } from 'react';
import { Button, Typography, Container } from '@mui/material';
import BasicRecipeInfo from '../components/recipe/BasicRecipeInfo';
import RecipeIngredients from '../components/recipe/RecipeIngredients';
import RecipeSteps from '../components/recipe/RecipeSteps';
import DietaryInfo from '../components/recipe/DietaryInfo';
import NavBar from '../components/NavBar';

const CreateRecipePage = () => {
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    image: '',
    ingredients: [{ name: '', amount: '', unit: '' }],
    steps: [{ description: '' }],
    cookingTime: '',
    servings: '',
    cuisine: '',
    dietaryInfo: {
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false
    }
  });

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
    <>
      <NavBar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>Create New Recipe</Typography>
      
      <form onSubmit={handleSubmit}>
        <BasicRecipeInfo 
          recipe={recipe} 
          setRecipe={setRecipe} 
        />
        
        <RecipeIngredients 
          ingredients={recipe.ingredients}
          setRecipe={setRecipe}
          recipe={recipe}
        />
        
        <RecipeSteps 
          steps={recipe.steps}
          setRecipe={setRecipe}
          recipe={recipe}
        />
        
        <DietaryInfo 
          dietaryInfo={recipe.dietaryInfo}
          setRecipe={setRecipe}
          recipe={recipe}
        />

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
    </Container>
    </>
  );
};

export default CreateRecipePage; 