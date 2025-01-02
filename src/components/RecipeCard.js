import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, CardMedia, Button } from '@mui/material';

const RecipeCard = ({ id, title, image, description }) => {
  return (
    <Card style={{ maxWidth: 345, margin: '1rem' }}>
      <CardMedia component="img" height="140" image={image} alt={title} />
      <CardContent>
        <Typography variant="h5">{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <Link to={`/recipe/${id}`} style={{ textDecoration: 'none' }}>
          <Button variant="contained" style={{ marginTop: '1rem' }}>
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
