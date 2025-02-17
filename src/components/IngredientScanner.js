import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import ImageUpload from './ImageUpload';

const IngredientScanner = ({ onIngredientsDetected }) => {
  const [scanning, setScanning] = useState(false);

  const handleImageUpload = async (imageUrl) => {
    try {
      setScanning(true);
      const response = await fetch('http://localhost:5000/api/vision/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl })
      });

      const data = await response.json();
      
      if (data.ingredients && data.ingredients.length > 0) {
        onIngredientsDetected(data.ingredients);
      } else {
        alert('No ingredients detected in the image');
      }
    } catch (error) {
      console.error('Error scanning ingredients:', error);
      alert('Error scanning ingredients');
    } finally {
      setScanning(false);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Scan Ingredients
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Upload an image of your ingredients or their packaging to automatically add them to your fridge
      </Typography>
      <ImageUpload onImageUpload={handleImageUpload} />
      {scanning && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Scanning ingredients...
        </Typography>
      )}
    </Box>
  );
};

export default IngredientScanner;
