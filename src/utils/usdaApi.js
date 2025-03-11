export const searchIngredients = async (query) => {
  if (!query || query.length < 2) return [];
  
  try {
    const response = await fetch(
      `http://localhost:5000/api/usda/search?query=${encodeURIComponent(query)}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch ingredients');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    return [];
  }
};