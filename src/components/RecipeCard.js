import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, CardMedia, Button, Box, IconButton, Rating } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';

const RecipeCard = ({ id, title, image, description, cookingTime, servings, reviews, actions }) => {
  const [isLiked, setIsLiked] = useState(false);

  // Calculate average rating
  const averageRating = reviews?.length 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length)
    : 0;

  useEffect(() => {
    checkIfLiked();
  }, [id]);

  const checkIfLiked = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`http://localhost:5000/api/users/liked-recipes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const likedRecipes = await response.json();
      setIsLiked(likedRecipes.some(recipe => recipe._id === id));
    } catch (error) {
      console.error('Error checking liked status:', error);
    }
  };

  const handleLikeToggle = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to like recipes');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/users/liked-recipes/${id}`, {
        method: isLiked ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setIsLiked(!isLiked);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={image}
        alt={title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {title}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 4, // Limit to 4 lines
            WebkitBoxOrient: 'vertical',
            minHeight: '80px' // Helps maintain consistent card heights
          }}
        >
          {description}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon sx={{ mr: 1 }} />
            <Typography variant="body2">{cookingTime} min</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PeopleIcon sx={{ mr: 1 }} />
            <Typography variant="body2">{servings} servings</Typography>
          </Box>
        </Box>
        {reviews?.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Rating value={averageRating} readOnly precision={0.5} />
          </Box>
        )}
        <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            component={Link}
            to={`/recipe/${id}`}
            variant="contained"
            color="primary"
            size="small"
          >
            View Details
          </Button>
          <IconButton
            onClick={handleLikeToggle}
            color={isLiked ? 'error' : 'default'}
          >
            {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Box>
        {actions && (
          <Box sx={{ mt: 2 }}>
            {actions}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
