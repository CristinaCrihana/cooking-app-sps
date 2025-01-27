import React, { useEffect, useState } from 'react';
import { 
  Container,
  Typography,
  Box,
  ButtonGroup,
  Button,
} from '@mui/material';
import FeaturedRecipeCard from '../components/FeaturedRecipeCard';
import NavBar from '../components/NavBar';

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredRecipes = recipes.filter(recipe => {
    if (filter === 'all') return true;
    if (filter === 'vegan') return recipe.dietaryInfo?.isVegan;
    if (filter === 'vegetarian') return recipe.dietaryInfo?.isVegetarian;
    if (filter === 'glutenFree') return recipe.dietaryInfo?.isGlutenFree;
    return true;
  });

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

  useEffect(() => {
    setCurrentIndex(0);
    
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const maxIndex = filteredRecipes.length;
        return prevIndex + 1 >= maxIndex ? 0 : prevIndex + 1;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [filteredRecipes.length]);

  const handleLikeToggle = async (recipeId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to like recipes');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/users/liked-recipes/${recipeId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Update the UI accordingly
        setRecipes(recipes.map(recipe => 
          recipe._id === recipeId 
            ? { ...recipe, isLiked: !recipe.isLiked }
            : recipe
        ));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const visibleRecipes = filteredRecipes.slice(currentIndex, currentIndex + 4);
  if (visibleRecipes.length < 4) {
    visibleRecipes.push(...filteredRecipes.slice(0, 4 - visibleRecipes.length));
  }

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
      <Container maxWidth="lg" sx={{ mt: 6, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          gutterBottom 
          sx={{ 
            fontWeight: 500,
            mb: 4
          }}
        >
          Featured Recipes
        </Typography>
        
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 1,
            mb: 6
          }}
        >
          {['All', 'Vegetarian', 'Vegan', 'Gluten-Free'].map((label) => (
            <Button
              key={label}
              onClick={() => setFilter(label.toLowerCase().replace('-', ''))}
              sx={{
                bgcolor: filter === label.toLowerCase().replace('-', '') 
                  ? 'primary.main' 
                  : 'rgba(255, 192, 203, 0.2)',
                color: filter === label.toLowerCase().replace('-', '')
                  ? 'white'
                  : 'text.primary',
                px: 3,
                py: 1,
                borderRadius: '20px',
                '&:hover': {
                  bgcolor: filter === label.toLowerCase().replace('-', '')
                    ? 'primary.dark'
                    : 'rgba(255, 192, 203, 0.3)',
                }
              }}
            >
              {label}
            </Button>
          ))}
        </Box>

        <Box 
          sx={{ 
            display: 'flex',
            gap: 3,
            overflowX: 'hidden',
            position: 'relative',
            minHeight: '400px',
            transition: 'transform 0.5s ease-in-out',
          }}
        >
          {visibleRecipes.map((recipe, index) => (
            <Box
              key={`${recipe._id}-${index}`}
              sx={{
                flex: '0 0 auto',
                width: 'calc(25% - 18px)',
                transition: 'transform 1.5s ease-in-out',
              }}
            >
              <FeaturedRecipeCard
                id={recipe._id}
                title={recipe.title}
                image={recipe.image}
                cookingTime={recipe.cookingTime}
                servings={recipe.servings}
                isLiked={recipe.isLiked}
                onLikeToggle={() => handleLikeToggle(recipe._id)}
              />
            </Box>
          ))}
        </Box>
      </Container>
    </>
  );
};

export default HomePage;
