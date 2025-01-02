import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Rating,
  Divider 
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const RecipeDetailsPage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/recipes/${id}`);
        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        console.error('Error fetching recipe:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading || !recipe) {
    return <div>Loading recipe details...</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          {recipe.title}
        </Typography>
        
        {/* Rating and Metadata */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Rating value={4} readOnly /> {/* Replace with actual rating */}
          <Typography variant="body2" color="text.secondary">
            24 ratings
          </Typography>
        </Box>

        {/* Tags and Prep Time */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          {recipe.dietaryInfo?.isVegetarian && (
            <Chip label="vegetarian" color="success" variant="outlined" />
          )}
          {recipe.dietaryInfo?.isGlutenFree && (
            <Chip label="gluten-free" color="warning" variant="outlined" />
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTimeIcon color="action" />
            <Typography variant="body2">prep time: 30 min</Typography>
          </Box>
        </Box>
      </Box>

      {/* Main Content Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
        {/* Left Column - Image */}
        <Box>
          <img 
            src={recipe.image} 
            alt={recipe.title}
            style={{ 
              width: '100%', 
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          />
        </Box>

        {/* Right Column - Ingredients */}
        <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50' }}>
          <Typography variant="h4" gutterBottom>
            Ingredients
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {recipe.servings || 2} serves
          </Typography>
          <List>
            {recipe.ingredients.map((ingredient, index) => (
              <ListItem key={index} sx={{ py: 1 }}>
                <ListItemIcon>
                  <CheckBoxOutlineBlankIcon />
                </ListItemIcon>
                <ListItemText>
                  {`${ingredient.amount} ${ingredient.unit} ${ingredient.name}`}
                </ListItemText>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>

      {/* Cooking Steps */}
      <Paper elevation={0} sx={{ mt: 4, p: 3, bgcolor: 'grey.50' }}>
        <Typography variant="h4" gutterBottom>
          Let's cook
        </Typography>
        <List>
          {recipe.steps.map((step, index) => (
            <React.Fragment key={index}>
              <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                <ListItemIcon>
                  <RestaurantIcon />
                </ListItemIcon>
                <ListItemText
                  primary={`${index + 1}. ${step.description}`}
                />
              </ListItem>
              {index < recipe.steps.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default RecipeDetailsPage;
