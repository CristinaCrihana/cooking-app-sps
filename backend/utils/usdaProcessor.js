const processUsdaResults = (data, query) => {
   // Process the foods from the API
   const processedFoods = data.foods.map(food => {
    // Find nutrients
    const calories = food.foodNutrients.find(n => n.nutrientName === 'Energy')?.value || 0;
    const protein = food.foodNutrients.find(n => n.nutrientName === 'Protein')?.value || 0;
    const carbs = food.foodNutrients.find(n => n.nutrientName === 'Carbohydrate, by difference')?.value || 0;
    const fat = food.foodNutrients.find(n => n.nutrientName === 'Total lipid (fat)')?.value || 0;
    const fiber = food.foodNutrients.find(n => n.nutrientName === 'Fiber, total dietary')?.value || 0;
    const sugar = food.foodNutrients.find(n => n.nutrientName === 'Total Sugars')?.value || 0;

    // Extract food measures (serving sizes)
    const foodMeasures = food.foodMeasures?.map(portion => ({
      disseminationText: portion.disseminationText,  // Changed from measureUnit to match schema
      gramWeight: portion.gramWeight // weight in grams
    })) || [];

    // Store the original description to help with filtering
    const originalDescription = food.description.toLowerCase();
    
    // Create a cleaned name for display and filtering
    let cleanedName = originalDescription
      .replace(/,.*$/, '')  // Remove everything after first comma
      .replace(/\s+with\s+.*$/, '')  // Remove "with..." descriptions
      .replace(/\s+in\s+.*$/, '')  // Remove "in..." descriptions
      .replace(/\s+from\s+.*$/, '')  // Remove "from..." descriptions
      .trim();
    
    // Keep track of processing state for better filtering
    const isProcessed = /dried|powder|concentrate|evaporated|condensed|dehydrated/.test(originalDescription);
    const isFortified = /fortified|enriched|added|supplemented/.test(originalDescription);
    const isFlavor = /flavored|flavor|vanilla|chocolate|strawberry/.test(originalDescription);
    const isFat = /whole|reduced fat|low[\s-]fat|non[\s-]fat|skim|fat[\s-]free|[0-9]+%/.test(originalDescription);
    
    return {
      fdcId: food.fdcId,
      originalName: originalDescription,
      name: cleanedName,
      dataType: food.dataType, // Add this to help with scoring
      attributes: {
        isProcessed,
        isFortified,
        isFlavor,
        isFat
      },
      nutritionPer100g: {
        calories,
        protein,
        carbohydrates: carbs,
        fat,
        fiber,
        sugar
      },
      foodMeasures
    };
  });
  
  // Identify exact query matches for prioritization
  const exactMatches = processedFoods.filter(food => {
    const exact = food.name.toLowerCase() === query.toLowerCase();
    const exactWithComma = food.originalName.toLowerCase().startsWith(query.toLowerCase() + ',');
    return exact || exactWithComma;
  });
  
  // Identify common basic variants (cow's milk, whole milk, etc.)
  const commonVariants = [];
  
  // Helper function to check if we've already included a very similar item
  const isDuplicate = (newItem, existingItems) => {
    return existingItems.some(item => {
      // Check for similar names
      return newItem.name === item.name;
    });
  };
  
  // Function to score an item's relevance and naturalness
  const scoreFood = (food) => {
    let score = 0;
    
    // Prioritize Survey (FNDDS) data
    if (food.dataType === 'Survey (FNDDS)') {
      score += 200; // Give significant boost to Survey data
    }
    
    // Exact query match gets high score
    if (food.name.toLowerCase() === query.toLowerCase()) {
      score += 100;
    }
    
    // Penalize processed forms
    if (food.attributes.isProcessed) {
      score -= 50;
    }
    
    // Slightly penalize fortified items
    if (food.attributes.isFortified) {
      score -= 10;
    }
    
    // Prefer basic items
    if (food.attributes.isFat && !food.attributes.isProcessed) {
      score += 5;
    }
    
    // Prefer shorter names (more basic)
    score -= food.name.length * 0.5;
    
    return score;
  };
  
  // Score and sort all foods
  const scoredFoods = processedFoods.map(food => ({
    ...food,
    score: scoreFood(food)
  })).sort((a, b) => b.score - a.score);
  
  // Group foods by "basic type" - e.g., all milk types together
  const foodGroups = {};
  
  scoredFoods.forEach(food => {
    // Extract the base food type (e.g., "milk" from "whole milk")
    let baseType = food.name;
    
    // Handle multi-word foods (e.g., "soy milk")
    if (baseType.includes(' ')) {
      // If it ends with our query term, use that as the base type
      if (baseType.endsWith(` ${query.toLowerCase()}`)) {
        baseType = query.toLowerCase();
      }
      // Otherwise for milk, cheese, yogurt - group by the last word
      else if (baseType.endsWith(' milk') || baseType.endsWith(' cheese') || baseType.endsWith(' yogurt')) {
        baseType = baseType.split(' ').pop();
      }
    }
    
    // Create the group if it doesn't exist
    if (!foodGroups[baseType]) {
      foodGroups[baseType] = [];
    }
    
    // Add to group
    foodGroups[baseType].push(food);
  });
  
  // Build final results:
  // 1. Include best representative from each group
  // 2. Include top variants for the most relevant groups
  
  const finalResults = [];
  
  // First add the best item from each group
  Object.keys(foodGroups).forEach(groupName => {
    // Sort the group by score
    const sortedGroup = foodGroups[groupName].sort((a, b) => b.score - a.score);
    
    // Take the best representative if it hasn't been added yet
    const bestRepresentative = sortedGroup[0];
    if (!isDuplicate(bestRepresentative, finalResults)) {
      finalResults.push(bestRepresentative);
    }
    
    // If this is the main group matching our query, add a few variations too
    if (groupName === query.toLowerCase()) {
      // Add a few variants (up to 3) if they're significantly different
      for (let i = 1; i < Math.min(sortedGroup.length, 4); i++) {
        const variant = sortedGroup[i];
        
        // Only add if it's substantially different and not processed
        if (!variant.attributes.isProcessed && 
            !isDuplicate(variant, finalResults) && 
            variant.score > bestRepresentative.score - 30) {
          finalResults.push(variant);
        }
      }
    }
  });
  
  // Sort final results by score
  finalResults.sort((a, b) => b.score - a.score);
  
  // Format the final output
  return finalResults.slice(0, 15).map(food => ({
    name: food.name,
    fdcId: food.fdcId,
    nutritionPer100g: food.nutritionPer100g,
    foodMeasures: food.foodMeasures,
    // Include original name only if significantly different from displayed name
    ...(food.name !== food.originalName && {originalDescription: food.originalName})
  }));
};

module.exports = { processUsdaResults }; 