import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Grid2,
  Button
} from '@mui/material';
import NavBar from '../components/NavBar';
import RecipeCard from '../components/RecipeCard';
import { canCookWithFridge } from '../utils/ingredientMatcher';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    cookingTime: '',
    cuisine: '',
    diet: '',
    fridgeFilter: false,
  });
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fridgeItems, setFridgeItems] = useState([]);

  // Sample filter options - you can modify these based on your needs
  const cookingTimes = ['< 30 mins', '30-60 mins', '> 60 mins'];
  const cuisines = ['Italian', 'Mexican', 'Indian', 'Chinese', 'Japanese', 'Mediterranean'];
  const diets = ['Vegetarian', 'Vegan', 'Gluten-Free', 'None'];
  const ALWAYS_AVAILABLE = ['salt', 'pepper'];

  useEffect(() => {
    fetchRecipes();
    fetchFridgeItems();
  }, []);

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

  const fetchFridgeItems = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await fetch('http://localhost:5000/api/users/fridge', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setFridgeItems(data);
    } catch (error) {
      console.error('Error fetching fridge items:', error);
    }
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFridgeFilterToggle = () => {
    setFilters(prev => ({
      ...prev,
      fridgeFilter: !prev.fridgeFilter
    }));
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDiet = !filters.diet || 
      (filters.diet === 'Vegetarian' && recipe.dietaryInfo?.isVegetarian) ||
      (filters.diet === 'Vegan' && recipe.dietaryInfo?.isVegan) ||
      (filters.diet === 'Gluten-Free' && recipe.dietaryInfo?.isGlutenFree) ||
      filters.diet === 'None';
    
    const matchesCookingTime = !filters.cookingTime || (
      (filters.cookingTime === '< 30 mins' && recipe.cookingTime < 30) ||
      (filters.cookingTime === '30-60 mins' && recipe.cookingTime >= 30 && recipe.cookingTime <= 60) ||
      (filters.cookingTime === '> 60 mins' && recipe.cookingTime > 60)
    );
    
    const matchesCuisine = !filters.cuisine || 
      recipe.cuisine === filters.cuisine;
    
    const matchesFridge = !filters.fridgeFilter || 
      canCookWithFridge(recipe.ingredients, fridgeItems);
    
    return matchesSearch && matchesDiet && matchesCookingTime && matchesCuisine && matchesFridge;
  });

  return (
    <>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Search Recipes
        </Typography>

        <Grid2 container spacing={3} sx={{ mb: 4 }}>
          <Grid2 item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search recipes"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid2>

          <Grid2 item xs={12} md={2}>
            <FormControl fullWidth sx={{ minWidth: 200 }}>
              <InputLabel>Cooking Time</InputLabel>
              <Select
                name="cookingTime"
                value={filters.cookingTime}
                label="Cooking Time"
                onChange={handleFilterChange}
              >
                <MenuItem value="">All</MenuItem>
                {cookingTimes.map(time => (
                  <MenuItem key={time} value={time}>{time}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid2>

          <Grid2 item xs={12} md={2}>
            <FormControl fullWidth sx={{ minWidth: 200 }}>
              <InputLabel>Cuisine</InputLabel>
              <Select
                name="cuisine"
                value={filters.cuisine}
                label="Cuisine"
                onChange={handleFilterChange}
              >
                <MenuItem value="">All</MenuItem>
                {cuisines.map(cuisine => (
                  <MenuItem key={cuisine} value={cuisine}>{cuisine}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid2>

          <Grid2 item xs={12} md={2}>
            <FormControl fullWidth sx={{ minWidth: 200 }}>
              <InputLabel>Diet</InputLabel>
              <Select
                name="diet"
                value={filters.diet}
                label="Diet"
                onChange={handleFilterChange}
              >
                <MenuItem value="">All</MenuItem>
                {diets.map(diet => (
                  <MenuItem key={diet} value={diet}>{diet}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid2>

          <Grid2 item xs={12} md={2}>
            <Button
              fullWidth
              variant={filters.fridgeFilter ? "contained" : "outlined"}
              onClick={handleFridgeFilterToggle}
              sx={{ height: '56px' }}
            >
              Cook from Fridge
            </Button>
          </Grid2>
        </Grid2>

        {loading ? (
          <Typography>Loading recipes...</Typography>
        ) : (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '20px' 
          }}>
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                id={recipe._id}
                title={recipe.title}
                image={recipe.image}
                description={recipe.description}
                cookingTime={recipe.cookingTime}
                servings={recipe.servings}
                reviews={recipe.reviews}
              />
            ))}
          </Box>
        )}
      </Container>
    </>
  );
};

export default SearchPage; 