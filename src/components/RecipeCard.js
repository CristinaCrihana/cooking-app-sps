import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, CardMedia, Button, Box, IconButton, Rating } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';

const RecipeCard = ({ id, title, image, description, cookingTime, servings, reviews }) => {
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
    <Card style={{ maxWidth: 345, margin: '1rem' }}>
      <CardMedia component="img" height="140" image={image} alt={title} />
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h5">{title}</Typography>
          <IconButton onClick={handleLikeToggle} color="primary" data-testid="like-button" >
            {isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
          </IconButton>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 5,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            height: '6em'
          }}
        >
          {description}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon sx={{ fontSize: 20, mr: 0.5 }} />
            <Typography variant="body2">{cookingTime} min</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PeopleIcon sx={{ fontSize: 20, mr: 0.5 }} />
            <Typography variant="body2">{servings} servings</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Link to={`/recipe/${id}`} style={{ textDecoration: 'none' }}>
            <Button variant="contained">
              View Details
            </Button>
          </Link>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Rating 
              value={averageRating} 
              precision={0.5} 
              readOnly 
              size="small"
            />
            {reviews?.length > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({reviews.length})
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
