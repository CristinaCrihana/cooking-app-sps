import React, { useEffect, useState } from 'react';
import RecipeCard from '../components/RecipeCard';

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/recipes');
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) {
    return <div>Loading recipes...</div>;
  }

  return (
    <div>
      <h1>Recipe List</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', padding: '20px' }}>
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe._id}
            id={recipe._id}
            title={recipe.title}
            image={recipe.image}
            description={recipe.description}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
