import { convert, standardizeUnit } from './unitConverter';

export const canCookWithFridge = (recipeIngredients, fridgeItems) => {
  const fridgeMap = new Map(
    fridgeItems.map(item => [
      item.name.toLowerCase(),
      { amount: parseFloat(item.quantity), unit: standardizeUnit(item.unit) }
    ])
  );

  // Check each recipe ingredient
  return recipeIngredients.every(recipeIng => {
    const recipeName = recipeIng.name.toLowerCase();
    
    // Skip checking for salt and pepper
    if (['salt', 'pepper'].includes(recipeName)) {
      return true;
    }

    const fridgeItem = fridgeMap.get(recipeName);
    if (!fridgeItem) return false;

    try {
      // Convert recipe amount to same unit as fridge item
      const recipeAmount = parseFloat(recipeIng.amount);
      const convertedRecipeAmount = convert(
        recipeAmount,
        standardizeUnit(recipeIng.unit),
        fridgeItem.unit
      );

      return fridgeItem.amount >= convertedRecipeAmount;
    } catch (error) {
      // If conversion fails, fall back to direct comparison
      console.warn(`Unit conversion failed for ${recipeName}:`, error);
      return false;
    }
  });
}; 