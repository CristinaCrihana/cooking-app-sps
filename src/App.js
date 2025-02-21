import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import corect pentru router
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import HomePage from './pages/HomePage'; // Asigură-te că importul este corect
import RecipeDetailsPage from './pages/RecipeDetailsPage'; // Asigură-te că acest fișier există
import LoginPage from './pages/LoginPage';
import CreateRecipePage from './pages/CreateRecipePage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import LikedRecipesPage from './pages/LikedRecipesPage';
import MyRecipesPage from './pages/MyRecipesPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} /> {/* Ruta principală */}
          <Route path="/login" element={<LoginPage />} /> {/* Login/Sign Up Page */}
          <Route path="/recipe/:id" element={<RecipeDetailsPage />} /> {/* Ruta pentru detalii */}
          <Route path="/create-recipe" element={<CreateRecipePage />} />
          <Route path="/create-recipe/:id" element={<CreateRecipePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/liked-recipes" element={<LikedRecipesPage />} />
          <Route path="/my-recipes" element={<MyRecipesPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
