import React from 'react';
import { TextField, Button, Typography } from '@mui/material';

const RecipeSteps = ({ steps, setRecipe, recipe }) => {
  const handleStepChange = (index, value) => {
    const newSteps = [...steps];
    newSteps[index].description = value;
    setRecipe({ ...recipe, steps: newSteps });
  };

  const addStep = () => {
    setRecipe({
      ...recipe,
      steps: [...steps, { description: '' }]
    });
  };

  return (
    <>
      <Typography variant="h6" sx={{ mt: 3 }}>Steps</Typography>
      {steps.map((step, index) => (
        <TextField
          key={index}
          fullWidth
          label={`Step ${index + 1}`}
          value={step.description}
          onChange={(e) => handleStepChange(index, e.target.value)}
          margin="normal"
          multiline
          required
        />
      ))}
      <Button onClick={addStep}>Add Step</Button>
    </>
  );
};

export default RecipeSteps; 