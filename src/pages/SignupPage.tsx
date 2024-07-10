// src/pages/SignupPage.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/App.css';
import Header from '../components/Header'

const SignupPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validity, setValidity] = useState({
    firstName: true,
    lastName: true,
    email: true,
    password: true,
  });
  const [errorMessage, setErrorMessage] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleValidation = (name: string, value: string) => {
    const nameRegex = /^[A-Za-z]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;
  
    let isValid = true;
    let message = '';

    switch (name) {
      case 'firstName':
        isValid = nameRegex.test(value);
        message = isValid ? '' : '- First name can only contain letters';
        break;
      case 'lastName':
        isValid = nameRegex.test(value);
        message = isValid ? '' : '- Last name can only contain letters';
        break;
      case 'email':
        isValid = emailRegex.test(value);
        message = isValid ? '' : '- Invalid Email';
        break;
      case 'password':
        isValid = passwordRegex.test(value);
        message = isValid ? '' : '- Password must be at least 8 characters long and contain at least one number and special character';
        break;
      default:
        break;
    }

    setValidity((prevState) => ({
      ...prevState,
      [name]: isValid,
    }));

    setErrorMessage((prevState) => ({
      ...prevState,
      [name]: message,
    }));

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isFirstNameValid = handleValidation('firstName', firstName);
    const isLastNameValid = handleValidation('lastName', lastName);
    const isEmailValid = handleValidation('email', email);
    const isPasswordValid = handleValidation('password', password);
    
    if(isFirstNameValid && isLastNameValid && isEmailValid && isPasswordValid){
      try {
        const response = await axios.post('/api/signup', {
          firstName,
          lastName,
          email,
          password,
        });
        if (response.data.success) {
          alert('Please check your email to verify your account.');
          navigate('/login');
        } else {
          alert('Error signing up');
        }
      } catch (error) {
        console.error('Error signing up:', error);
      }
    }
  };

  return (
    <div>
      <Header />
      <div className="form-container">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
            <div className="input-container">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  handleValidation('firstName', e.target.value);
                }}
                required
              />
              {!validity.firstName && <span className="regexError">x</span>}
            </div>
            <div className='input-container'>
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  handleValidation('lastName', e.target.value);
                }}
              required
              />
              {!validity.lastName && <span className="regexError">x</span>}
            </div>
            <div className='input-container'>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  handleValidation('email', e.target.value);
                }}
                required
              />
              {!validity.email && <span className="regexError">x</span>}
            </div>
            <div className="input-container">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  handleValidation('password', e.target.value);
                }}
                required
              />
            {!validity.password && <span className="regexError">x</span>}
          </div>
          {errorMessage.firstName && <p className="validation-message">{errorMessage.firstName}</p>}
          {errorMessage.lastName && <p className="validation-message">{errorMessage.lastName}</p>}
          {errorMessage.email && <p className="validation-message">{errorMessage.email}</p>}
          {errorMessage.password && <p className="validation-message">{errorMessage.password}</p>}
          <button type="submit">Sign Up</button>
        </form>
        <p className="link">Already have an account? <Link to="/login">Log in!</Link></p>
      </div>
    </div>
  );
};

export default SignupPage;
