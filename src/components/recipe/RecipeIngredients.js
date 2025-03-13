import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Autocomplete,
  CircularProgress,
  Tooltip,
  IconButton
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { searchIngredients } from '../../utils/usdaApi';
import { convert, standardizeUnit } from '../../utils/unitConverter';

const RecipeIngredients = ({ ingredients, setRecipe, recipe }) => {
  const [loading, setLoading] = useState({});
  const [options, setOptions] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const handleIngredientChange = (index, field, value, nutritionData = null) => {
    const newIngredients = [...ingredients];
    
    if (field === 'fullData') {
      // Handle selection from autocomplete
      console.log('Selected ingredient full data:', value);
      
      newIngredients[index] = {
        ...newIngredients[index],
        name: value.name,
        fdcId: value.fdcId,
        nutritionPer100g: value.nutritionPer100g,
        foodMeasures: value.foodMeasures
      };
    } else {
      // Handle manual input changes
      newIngredients[index][field] = value;
    }

    // Calculate total nutrition whenever ingredients change
    const totalNutrition = calculateTotalNutrition(newIngredients);
    
    setRecipe({ 
      ...recipe, 
      ingredients: newIngredients,
      totalNutrition
    });
  };

  const calculateTotalNutrition = (ingredients) => {
    const total = {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      fiber: 0,
      sugar: 0
    };

    ingredients.forEach(ingredient => {
      if (ingredient.nutritionPer100g && ingredient.amount) {
        const amount = parseFloat(ingredient.amount);
        if (!isNaN(amount)) {
          try {
            // Convert amount to grams using the unitConverter
            let grams = convert(amount, ingredient.unit, 'g');
            
            // Calculate nutrition based on amount (per 100g)
            const multiplier = grams / 100;
            Object.keys(total).forEach(nutrient => {
              total[nutrient] += (ingredient.nutritionPer100g[nutrient] || 0) * multiplier;
            });
          } catch (error) {
            console.error(`Conversion error for ingredient ${ingredient.name}:`, error);
          }
        }
      }
    });

    // Round all values to 1 decimal place
    Object.keys(total).forEach(key => {
      total[key] = Math.round(total[key] * 10) / 10;
    });

    return total;
  };

  const handleIngredientSearch = async (index, searchText) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (!searchText || searchText.length < 2) {
      setOptions([]);
      return;
    }

    setLoading(prev => ({ ...prev, [index]: true }));
    
    const timeoutId = setTimeout(async () => {
      try {
        const results = await searchIngredients(searchText);
        console.log('USDA API Raw Response:', JSON.stringify(results, null, 2));
        console.log('Search results:', results);
        setOptions(results);
      } catch (error) {
        console.error('Search error:', error);
        setOptions([]);
      } finally {
        setLoading(prev => ({ ...prev, [index]: false }));
      }
    }, 300);

    setSearchTimeout(timeoutId);
  };

  const addIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [...ingredients, { 
        name: '', 
        amount: '', 
        unit: '',
        fdcId: '',
        nutritionPer100g: null,
        foodMeasures: []
      }]
    });
  };

  const getNutritionTooltip = (ingredient) => {
    if (!ingredient.nutritionPer100g) return "No nutrition data available";
    
    return `
      Per 100g:
      Calories: ${ingredient.nutritionPer100g.calories}
      Protein: ${ingredient.nutritionPer100g.protein}g
      Carbs: ${ingredient.nutritionPer100g.carbohydrates}g
      Fat: ${ingredient.nutritionPer100g.fat}g
      Fiber: ${ingredient.nutritionPer100g.fiber}g
      Sugar: ${ingredient.nutritionPer100g.sugar}g
    `;
  };

  return (
    <>
      <Typography variant="h6" sx={{ mt: 3 }}>Ingredients</Typography>
      {ingredients.map((ingredient, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
          <Autocomplete
            freeSolo
            options={options}
            getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
            loading={loading[index]}
            onInputChange={(event, value) => handleIngredientSearch(index, value)}
            onChange={(event, newValue) => {
              handleIngredientChange(
                index,
                'fullData',
                newValue || { name: '', fdcId: '', nutritionPer100g: null }
              );
            }}
            value={ingredient}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Ingredient"
                required
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading[index] ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            sx={{ flex: 2 }}
          />
          <TextField
            label="Amount"
            value={ingredient.amount}
            onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
            required
            sx={{ flex: 1 }}
          />
          <TextField
            label="Unit"
            value={ingredient.unit}
            onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
            required
            sx={{ flex: 1 }}
          />
          {ingredient.nutritionPer100g && (
            <Tooltip title={getNutritionTooltip(ingredient)}>
              <IconButton size="small">
                <InfoIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ))}
      <Button onClick={addIngredient}>Add Ingredient</Button>

      {recipe.totalNutrition && (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>Total Recipe Nutrition</Typography>
          <Typography>Calories: {recipe.totalNutrition.calories}</Typography>
          <Typography>Protein: {recipe.totalNutrition.protein}g</Typography>
          <Typography>Carbohydrates: {recipe.totalNutrition.carbohydrates}g</Typography>
          <Typography>Fat: {recipe.totalNutrition.fat}g</Typography>
          <Typography>Fiber: {recipe.totalNutrition.fiber}g</Typography>
          <Typography>Sugar: {recipe.totalNutrition.sugar}g</Typography>
        </Box>
      )}
    </>
  );
};

export default RecipeIngredients; 