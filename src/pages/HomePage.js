import React, { useEffect, useState } from 'react';
import { 
  Container,
  Typography,
  Box
} from '@mui/material';
import RecipeCard from '../components/RecipeCard';
import NavBar from '../components/NavBar';

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/recipes');
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) {
    return (
      <>
        <NavBar />
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Typography>Loading recipes...</Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Recipe List
        </Typography>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '20px', 
          mt: 4 
        }}>
          {recipes.map((recipe) => (
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

export default HomePage;
