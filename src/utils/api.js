import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const recipeApi = {
  searchByIngredients: (ingredients) => 
    api.post('/recipes/search', { ingredients }),
  
  getNutritionalAnalysis: (recipeId) =>
    api.get(`/recipes/${recipeId}/nutrition`),
  
  createRecipe: (recipeData) =>
    api.post('/recipes', recipeData),
  
  getRecipesByDiet: (dietType) =>
    api.get(`/recipes/diet/${dietType}`),
  
  generateShoppingList: (recipeIds) =>
    api.post('/shopping-list', { recipeIds }),
  
  getTrends: () =>
    api.get('/analytics/trends')
};
