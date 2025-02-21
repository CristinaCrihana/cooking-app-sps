import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography, Container } from '@mui/material';
import BasicRecipeInfo from '../components/recipe/BasicRecipeInfo';
import RecipeIngredients from '../components/recipe/RecipeIngredients';
import RecipeSteps from '../components/recipe/RecipeSteps';
import DietaryInfo from '../components/recipe/DietaryInfo';
import NavBar from '../components/NavBar';

const CreateRecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  useEffect(() => {
    if (id) {
      fetchRecipe();
    }
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/recipes/${id}`);
      const data = await response.json();
      setRecipe(data);
    } catch (error) {
      console.error('Error fetching recipe:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = id 
        ? `http://localhost:5000/api/recipes/${id}`
        : 'http://localhost:5000/api/recipes';
      
      const method = id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(recipe)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Failed to ${id ? 'update' : 'create'} recipe: ${errorData.message}`);
        return;
      }
  
      alert(`Recipe ${id ? 'updated' : 'created'} successfully!`);
      navigate('/my-recipes');
    } catch (error) {
      console.error(`Error ${id ? 'updating' : 'creating'} recipe:`, error);
      alert(`Error ${id ? 'updating' : 'creating'} recipe`);
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