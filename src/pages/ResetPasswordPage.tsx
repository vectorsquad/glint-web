import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import '../styles/App.css';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const code = new URLSearchParams(location.search).get('user_code');

  const handlePasswordValidation = (value: string) => {
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*()])(?=.*[a-zA-Z]).{8,}$/;

    let message = '';
    if (!passwordRegex.test(value)) {
      message = '- Password must be at least 8 characters long and contain at least one number and one special character';
    }
    setErrorMessage(message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (errorMessage) {
      setError('Please fix the errors before submitting');
      return;
    }

    try {
      const response = await axios.post(`/api/v1/updatePassword?user_code=${code}`, { password: password });

      if (response.status >= 200 || response.status < 300) {
        alert("Password changed!");
        navigate('/login');
      } else {
        setError('Failed to update password');
      }
    } catch (error: any) {
      console.error('Error updating password:', error);
      setError(error.response?.data?.message || 'Error updating password');
    }
  };

  return (
    <div>
      <Header />
      <div className="form-container">
        <h1>Reset Password</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                handlePasswordValidation(e.target.value);
              }}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                handlePasswordValidation(e.target.value);
              }}
              required
            />
          </div>
          {errorMessage && <p className="validation-message">{errorMessage}</p>}
          <button type="submit">Change Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
