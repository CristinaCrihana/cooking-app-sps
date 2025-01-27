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

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          type="number"
          label="Cooking Time (minutes)"
          value={recipe.cookingTime}
          onChange={(e) => setRecipe({ ...recipe, cookingTime: parseInt(e.target.value) || '' })}
          required
          InputProps={{ inputProps: { min: 1 } }}
          sx={{ flex: 1 }}
        />

        <TextField
          type="number"
          label="Number of Servings"
          value={recipe.servings}
          onChange={(e) => setRecipe({ ...recipe, servings: parseInt(e.target.value) || '' })}
          required
          InputProps={{ inputProps: { min: 1 } }}
          sx={{ flex: 1 }}
        />
      </Box>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Cuisine</InputLabel>
        <Select
        id="cuisine-select" // Add this explicit id
        labelId="cuisine-label"
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
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>
    </>
  );
};

export default BasicRecipeInfo; 