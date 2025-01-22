import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        navigate('/'); // Redirect to home page after successful login/signup
      } else {
        setMessage(data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setIsLogin(true)}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            background: isLogin ? '#007BFF' : '#f0f0f0',
            color: isLogin ? 'white' : 'black',
            border: '1px solid #ccc',
            cursor: 'pointer',
          }}
        >
          Login
        </button>
        <button
          onClick={() => setIsLogin(false)}
          style={{
            padding: '10px 20px',
            background: !isLogin ? '#007BFF' : '#f0f0f0',
            color: !isLogin ? 'white' : 'black',
            border: '1px solid #ccc',
            cursor: 'pointer',
          }}
        >
          Sign Up
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div style={{ marginBottom: '15px' }}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            />
          </div>
        )}
        <div style={{ marginBottom: '15px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            background: '#007BFF',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {isLogin ? 'Log In' : 'Sign Up'}
        </button>
      </form>
      {message && <p style={{ color: 'red', marginTop: '20px' }}>{message}</p>}
    </div>
  );
};

export default LoginPage;
