import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Rating, 
  TextField, 
  Typography,
  Box 
} from '@mui/material';

const ReviewDialog = ({ open, onClose, onSubmit, recipeId }) => {
  const [userReview, setUserReview] = useState({ rating: 0, comment: '' });
  const [error, setError] = useState('');

  const handleClose = () => {
    setUserReview({ rating: 0, comment: '' });
    setError('');
    onClose();
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to submit a review');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/recipes/${recipeId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userReview)
      });

      const data = await response.json();

      if (response.ok) {
        onSubmit(data);
        handleClose();
      } else {
        setError(data.message || 'Failed to add review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Error submitting review');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Review</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Rating
            value={userReview.rating}
            onChange={(_, newValue) => {
              setUserReview(prev => ({ ...prev, rating: newValue }));
            }}
          />
          <TextField
            multiline
            rows={4}
            label="Your Review (optional)"
            value={userReview.comment}
            onChange={(e) => setUserReview(prev => ({ ...prev, comment: e.target.value }))}
          />
          {error && (
            <Typography color="error">{error}</Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit}
          disabled={!userReview.rating}
        >
          Submit Review
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewDialog; 