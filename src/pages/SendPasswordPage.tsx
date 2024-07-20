import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import '../styles/App.css';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';

const sendPasswordPage: React.FC = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [error, setError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/v1/sendPasswordRecovery', { usernameOrEmail });

      if (response.status === 200) {
        alert("An email to reset your password was sent.");
        navigate('/login');
      } else {
        setError('Failed to send email');
      }
    } catch (error: any) {
      console.error('Error sending the password recovery:', error);
      setError(error.response?.data?.message || 'Error sending the password recovery');
    }
  };

  return (
    <div>
      <Header />
      <div className="form-container">
        <h1>Reset Password</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
            <p>Enter your email or username, if there is an account with the email or username entered, you will receive an email to change your password.</p>
          <div className="input-container">
            <input
              type="text"
              placeholder="Email or Username"
              value={usernameOrEmail}
              onChange={(e) => {
                setUsernameOrEmail(e.target.value);
              }}
              required
            />
          </div>
          <button type="submit">Send email recovery</button>
        </form>
      </div>
    </div>
  );
};

export default sendPasswordPage;
