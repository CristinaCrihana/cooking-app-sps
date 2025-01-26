import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { 
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Alert
} from '@mui/material';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/login' : '/signup';
    
    try {
      const response = await fetch(`http://localhost:5000/api/users${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        setMessage(data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <>
    <NavBar />
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Typography>

          <ToggleButtonGroup
            value={isLogin}
            exclusive
            onChange={(e, newValue) => {
              if (newValue !== null) {
                setIsLogin(newValue);
                setMessage('');
              }
            }}
            sx={{ mb: 3 }}
          >
            <ToggleButton 
              value={true}
              sx={{ 
                px: 4,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                },
              }}
            >
              Login
            </ToggleButton>
            <ToggleButton 
              value={false}
              sx={{ 
                px: 4,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                },
              }}
            >
              Sign Up
            </ToggleButton>
          </ToggleButtonGroup>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            {!isLogin && (
              <TextField
                margin="normal"
                required
                fullWidth
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ mb: 2 }}
              />
            )}
            
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
            />

            {message && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {message}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 2,
                mb: 2,
                height: '48px',
                fontSize: '1.1rem',
              }}
            >
              {isLogin ? 'Log In' : 'Sign Up'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
    </>
  );
};

export default LoginPage;
