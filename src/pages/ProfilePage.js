import React, { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import NavBar from '../components/NavBar';
import MyFridge from '../components/fridge/MyFridge';

const ProfilePage = () => {
  const [fridgeItems, setFridgeItems] = useState(() => {
    // Load fridge items from localStorage on initial render
    const savedItems = localStorage.getItem('fridgeItems');
    return savedItems ? JSON.parse(savedItems) : [];
  });

  // Save fridge items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('fridgeItems', JSON.stringify(fridgeItems));
  }, [fridgeItems]);

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
            setFridgeItems={setFridgeItems} 
          />
        </Box>
      </Container>
    </>
  );
};

export default ProfilePage; 