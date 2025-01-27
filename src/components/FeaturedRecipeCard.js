import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import { Link } from 'react-router-dom';

const FeaturedRecipeCard = ({ id, title, image, cookingTime, servings, isLiked, onLikeToggle }) => {
  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          transition: 'transform 0.3s ease-in-out'
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Link to={`/recipe/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <CardMedia
            component="img"
            height="300"
            image={image}
            alt={title}
            sx={{
              objectFit: 'cover',
            }}
          />
        </Link>
        <IconButton
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 1)',
            }
          }}
          onClick={(e) => {
            e.preventDefault();
            onLikeToggle();
          }}
        >
          {isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
        </IconButton>
      </Box>
      
      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2,
            fontWeight: 500,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {title}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon sx={{ fontSize: 20, mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {cookingTime} min
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PeopleIcon sx={{ fontSize: 20, mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {servings} servings
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FeaturedRecipeCard; 