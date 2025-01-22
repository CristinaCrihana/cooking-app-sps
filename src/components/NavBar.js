import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    // Optionally refresh the page or trigger a re-render
    window.location.reload();
    // Alternative: navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/search">
            Search
          </Button>
        </Box>
        
        {isLoggedIn && (
          <Button 
            color="inherit" 
            component={Link} 
            to="/create-recipe"
            sx={{ mr: 2 }}
          >
            Create Recipe
          </Button>
        )}
        
        {isLoggedIn ? (
          <Button 
            color="inherit" 
            onClick={handleLogout}
          >
            Logout
          </Button>
        ) : (
          <Button 
            color="inherit" 
            component={Link} 
            to="/login"
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar; 