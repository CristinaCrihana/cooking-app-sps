import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import RecipeCard from '../components/RecipeCard';

const MyRecipesPage = () => {
  const [myRecipes, setMyRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  const fetchMyRecipes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/recipes/user/my-recipes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setMyRecipes(data);
    } catch (error) {
      console.error('Error fetching my recipes:', error);
    }
  };

  const handleEdit = (recipeId) => {
    navigate(`/create-recipe/${recipeId}`);
  };

  const handleDelete = async (recipeId) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:5000/api/recipes/${recipeId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setMyRecipes(myRecipes.filter(recipe => recipe._id !== recipeId));
      } catch (error) {
        console.error('Error deleting recipe:', error);
      }
    }
  };

  return (
    <>
      <NavBar />
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom>
            My Recipes
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '20px' 
          }}>
            {myRecipes.map((recipe) => (
              <Box key={recipe._id}>
                <RecipeCard
                  {...recipe}
                  actions={
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => handleEdit(recipe._id)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="contained" 
                        color="error"
                        onClick={() => handleDelete(recipe._id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  }
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default MyRecipesPage;