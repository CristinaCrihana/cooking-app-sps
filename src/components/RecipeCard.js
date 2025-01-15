import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, CardMedia, Button, Box } from '@mui/material';

const RecipeCard = ({ id, title, image, description }) => {
  return (
    <Card style={{ maxWidth: 345, margin: '1rem' }}>
      <CardMedia component="img" height="140" image={image} alt={title} />
      <CardContent>
        <Typography variant="h5">{title}</Typography>
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
