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
  Divider,
  Button
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ReviewDialog from '../components/ReviewDialog';
import NavBar from '../components/NavBar';

const RecipeDetailsPage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);

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

  const handleOpenReviewDialog = () => setOpenReviewDialog(true);
  const handleCloseReviewDialog = () => setOpenReviewDialog(false);

  const handleSubmitReview = (updatedRecipe) => {
    setRecipe(updatedRecipe);
    handleCloseReviewDialog();
  };

  if (loading || !recipe) {
    return <div>Loading recipe details...</div>;
  }

  return (
    <>
    <NavBar />  
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          {recipe.title}
        </Typography>
        
        {/* Rating and Metadata */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Rating 
            value={Number(recipe.averageRating)} 
            precision={0.5} 
            readOnly 
          />
          <Typography variant="body2" color="text.secondary">
            {recipe.reviewCount} {recipe.reviewCount === 1 ? 'rating' : 'ratings'}
          </Typography>
        </Box>

        {/* Tags, Time, and Cuisine */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          {recipe.dietaryInfo?.isVegetarian && (
            <Chip label="Vegetarian" color="success" variant="outlined" />
          )}
          {recipe.dietaryInfo?.isVegan && (
            <Chip label="Vegan" color="success" variant="outlined" />
          )}
          {recipe.dietaryInfo?.isGlutenFree && (
            <Chip label="Gluten-Free" color="warning" variant="outlined" />
          )}
          <Chip label={recipe.cuisine} color="primary" variant="outlined" />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTimeIcon color="action" />
            <Typography variant="body2">{recipe.cookingTime} minutes</Typography>
          </Box>
        </Box>

        <Typography variant="body1" sx={{ mb: 3 }}>
          {recipe.description}
        </Typography>
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
          <Typography variant="subtitle1" gutterBottom color="primary">
            Serves {recipe.servings} people
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

      {/* Reviews List */}
      <Paper elevation={0} sx={{ mt: 4, p: 3, bgcolor: 'grey.50' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">
            Reviews
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleOpenReviewDialog}
          >
            Add Review
          </Button>
        </Box>
        
        {recipe.reviews.length > 0 ? (
          <List>
            {recipe.reviews.map((review, index) => (
              <React.Fragment key={index}>
                <ListItem alignItems="flex-start">
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="subtitle1">
                        {review.user.name}
                      </Typography>
                      <Rating value={review.rating} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    {review.comment && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {review.comment}
                      </Typography>
                    )}
                  </Box>
                </ListItem>
                {index < recipe.reviews.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography>No reviews yet</Typography>
        )}
      </Paper>

      <ReviewDialog
        open={openReviewDialog}
        onClose={handleCloseReviewDialog}
        onSubmit={handleSubmitReview}
        recipeId={id}
      />
    </Container>
    </>
  );
};

export default RecipeDetailsPage;
