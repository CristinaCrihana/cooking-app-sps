import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, CardMedia, Button, Box, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const RecipeCard = ({ id, title, image, description }) => {
  const [isLiked, setIsLiked] = useState(false);

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
    <Card style={{ maxWidth: 345, margin: '1rem' }}>
      <CardMedia component="img" height="140" image={image} alt={title} />
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h5">{title}</Typography>
          <IconButton onClick={handleLikeToggle} color="primary">
            {isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Link to={`/recipe/${id}`} style={{ textDecoration: 'none' }}>
            <Button variant="contained">
              View Details
            </Button>
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
