import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import MyFridge from '../components/fridge/MyFridge';
import ShoppingList from '../components/ShoppingList';

const ProfilePage = () => {
  const [fridgeItems, setFridgeItems] = useState([]);
  const [likedRecipes, setLikedRecipes] = useState([]);

  useEffect(() => {
    fetchFridgeItems();
    fetchLikedRecipes();
  }, []);

  const fetchFridgeItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/fridge', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setFridgeItems(data);
    } catch (error) {
      console.error('Error fetching fridge items:', error);
    }
  };

  const fetchLikedRecipes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/liked-recipes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setLikedRecipes(data);
    } catch (error) {
      console.error('Error fetching liked recipes:', error);
    }
  };

  const updateFridgeItems = async (newItems) => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/users/fridge', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newItems)
      });
      setFridgeItems(newItems);
    } catch (error) {
      console.error('Error updating fridge items:', error);
    }
  };

  return (
    <>
      <NavBar />
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              My Profile
            </Typography>
            <Button
              component={Link}
              to="/liked-recipes"
              variant="contained"
              color="primary"
            >
              View Liked Recipes
            </Button>
          </Box>
          <MyFridge 
            fridgeItems={fridgeItems} 
            setFridgeItems={updateFridgeItems} 
          />
          <ShoppingList 
            fridgeItems={fridgeItems}
            likedRecipes={likedRecipes}
          />
        </Box>
      </Container>
    </>
  );
};

export default ProfilePage; 