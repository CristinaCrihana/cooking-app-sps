import React, { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import NavBar from '../components/NavBar';
import MyFridge from '../components/fridge/MyFridge';

const ProfilePage = () => {
  const [fridgeItems, setFridgeItems] = useState([]);

  useEffect(() => {
    fetchFridgeItems();
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
          <Typography variant="h4" gutterBottom>
            My Profile
          </Typography>
          <MyFridge 
            fridgeItems={fridgeItems} 
            setFridgeItems={updateFridgeItems} 
          />
        </Box>
      </Container>
    </>
  );
};

export default ProfilePage; 