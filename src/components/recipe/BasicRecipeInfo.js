import React from 'react';
import { TextField, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import ImageUpload from '../ImageUpload';

const BasicRecipeInfo = ({ recipe, setRecipe }) => {
  const handleImageUpload = (imageUrl) => {
    setRecipe({ ...recipe, image: imageUrl });
  };

  return (
    <>
      <TextField
        fullWidth
        label="Recipe Title"
        value={recipe.title}
        onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Description"
        value={recipe.description}
        onChange={(e) => setRecipe({ ...recipe, description: e.target.value })}
        margin="normal"
        multiline
        rows={3}
        required
      />

      <Box sx={{ mt: 3, mb: 2 }}>
        <ImageUpload onImageUpload={handleImageUpload} />
        {recipe.image && (
          <Box sx={{ mt: 2 }}>
            <img 
              src={recipe.image} 
              alt="Recipe preview" 
              style={{ maxWidth: '200px', borderRadius: '4px' }} 
            />
          </Box>
        )}
      </Box>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Cooking Time</InputLabel>
        <Select
          value={recipe.cookingTime}
          label="Cooking Time"
          onChange={(e) => setRecipe({ ...recipe, cookingTime: e.target.value })}
          required
        >
          <MenuItem value="< 30 mins">Less than 30 minutes</MenuItem>
          <MenuItem value="30-60 mins">30-60 minutes</MenuItem>
          <MenuItem value="> 60 mins">More than 60 minutes</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Cuisine</InputLabel>
        <Select
          value={recipe.cuisine}
          label="Cuisine"
          onChange={(e) => setRecipe({ ...recipe, cuisine: e.target.value })}
          required
        >
          <MenuItem value="Italian">Italian</MenuItem>
          <MenuItem value="Mexican">Mexican</MenuItem>
          <MenuItem value="Indian">Indian</MenuItem>
          <MenuItem value="Chinese">Chinese</MenuItem>
          <MenuItem value="Japanese">Japanese</MenuItem>
          <MenuItem value="Mediterranean">Mediterranean</MenuItem>
        </Select>
      </FormControl>
    </>
  );
};

export default BasicRecipeInfo; 