import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import corect pentru router
import HomePage from './pages/HomePage'; // Asigură-te că importul este corect
import RecipeDetailsPage from './pages/RecipeDetailsPage'; // Asigură-te că acest fișier există
import LoginPage from './pages/LoginPage';
import CreateRecipePage from './pages/CreateRecipePage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* Ruta principală */}
        <Route path="/login" element={<LoginPage />} /> {/* Login/Sign Up Page */}
        <Route path="/recipe/:id" element={<RecipeDetailsPage />} /> {/* Ruta pentru detalii */}
        <Route path="/create-recipe" element={<CreateRecipePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
