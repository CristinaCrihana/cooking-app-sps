import React, { useEffect, useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import RecipeCard from '../components/RecipeCard';
import NavBar from '../components/NavBar';

const LikedRecipesPage = () => {
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLikedRecipes();
  }, []);

  const fetchLikedRecipes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/liked-recipes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setLikedRecipes(data);
    } catch (error) {
      console.error('Error fetching liked recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Typography>Loading liked recipes...</Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          My Liked Recipes
        </Typography>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '20px', 
          mt: 4 
        }}>
          {likedRecipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              id={recipe._id}
              title={recipe.title}
              image={recipe.image}
              description={recipe.description}
              reviews={recipe.reviews}
            />
          ))}
        </Box>
      </Container>
    </>
  );
};

export default LikedRecipesPage;