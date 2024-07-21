import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/App.css';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/v1/login', {
        login: {
          username: username,
          password_hash: password,
        },
      });

      console.log('Response status:', response.status);
      console.log('Response data:', response.data);

      if (response.status >= 200 && response.status < 300) {
        const token = response.data.token || document.cookie;
        console.log('Token:', token);

        if (token) {
          setUser({ token });
          navigate('/dashboard');
        } else {
          setError('Invalid login: Token not received');
        }
      } else {
        setError('Invalid login');
      }
    } catch (error: any) {
      console.error('Error logging in:', error);
      setError(error.response?.data?.message || 'Error logging in');
    }
  };

  const handleResetPassword = () => {
    navigate('/sendPassword');
  };

  const resetPasswordButtonStyle = {
    marginTop: '10px',
    padding: '8px 12px',
    backgroundColor: '#15db63',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s, box-shadow 0.3s',
    fontSize: '14px',
    fontWeight: 'bold',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div>
      <Header />
      <div className="form-container">
        <h1>Log In</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Log In</button>
        </form>
        <p className="link">New here? <Link to="/signup">Sign up!</Link></p>
        <button 
          onClick={handleResetPassword} 
          style={resetPasswordButtonStyle}
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default LoginPage;