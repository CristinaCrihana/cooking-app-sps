import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = () => {
  const isLoggedIn = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
          <Button
            component={Link}
            to="/"
            color="inherit"
          >
            Home
          </Button>
          
          <Button
            component={Link}
            to="/search"
            color="inherit"
          >
            Search Recipes
          </Button>
          
          <Button
            component={Link}
            to="/create-recipe"
            color="inherit"
          >
            Create Recipe
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {isLoggedIn ? (
            <>
              <Button
                component={Link}
                to="/profile"
                color="inherit"
              >
                My Profile
              </Button>
              <Button
                component={Link}
                to="/my-recipes"
                color="inherit"
              >
                My Recipes
              </Button>
              <Button
                color="inherit"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              component={Link}
              to="/login"
              color="inherit"
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar; 