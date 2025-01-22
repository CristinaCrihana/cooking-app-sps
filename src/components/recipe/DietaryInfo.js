import React from 'react';
import { Checkbox, FormControlLabel, Box, Typography } from '@mui/material';

const DietaryInfo = ({ dietaryInfo, setRecipe, recipe }) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6">Dietary Information</Typography>
      <FormControlLabel
        control={
          <Checkbox
            checked={dietaryInfo.isVegetarian}
            onChange={(e) => setRecipe({
              ...recipe,
              dietaryInfo: { ...dietaryInfo, isVegetarian: e.target.checked }
            })}
          />
        }
        label="Vegetarian"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={dietaryInfo.isVegan}
            onChange={(e) => setRecipe({
              ...recipe,
              dietaryInfo: { ...dietaryInfo, isVegan: e.target.checked }
            })}
          />
        }
        label="Vegan"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={dietaryInfo.isGlutenFree}
            onChange={(e) => setRecipe({
              ...recipe,
              dietaryInfo: { ...dietaryInfo, isGlutenFree: e.target.checked }
            })}
          />
        }
        label="Gluten Free"
      />
    </Box>
  );
};

export default DietaryInfo; 