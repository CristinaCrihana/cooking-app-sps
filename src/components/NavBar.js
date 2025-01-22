import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const NavBar = () => {
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

        <Box>
          <Button
            component={Link}
            to="/profile"
            color="inherit"
          >
            My Profile
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar; 