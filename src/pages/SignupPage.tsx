import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/App.css';
import Header from '../components/Header';

const SignupPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validity, setValidity] = useState({
    firstName: true,
    lastName: true,
    email: true,
    username: true,
    password: true,
  });
  const [errorMessage, setErrorMessage] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleValidation = (name: string, value: string) => {
    const nameRegex = /^[A-Za-z]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const usernameRegex = /^[A-Za-z0-9]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*()])(?=.*[a-zA-Z]).{8,}$/;
  
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
      case 'username':
        isValid = usernameRegex.test(value);
        message = isValid ? '' : '- Username can only contain letters and numbers'
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
    const isUsernameValid = handleValidation('username', username); // Removed the unused variable assignment
    const isPasswordValid = handleValidation('password', password);
    
    if(isFirstNameValid && isLastNameValid && isEmailValid && isUsernameValid && isPasswordValid){
      try {
        const response = await axios.post('/api/v1/register', {
          name_first: firstName,
          name_last: lastName,
          email: email,
          username: username,
          password_hash: password,
        });
        if (response.status >= 200 && response.status <300) {
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

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
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
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                handleValidation('username', e.target.value);
              }}
              required
            />
            {!validity.username && <span className="regexError">x</span>}
          </div>
          <div className="input-container">
            <input
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                handleValidation('password', e.target.value);
              }}
              required
            />
            <img
              src={passwordVisible ? '/visible.png' : '/hide.png'}
              alt={passwordVisible ? 'Hide password' : 'Show password'}
              className="password-toggle-icon"
              onClick={togglePasswordVisibility}
            />
            {!validity.password && <span className="regexError">x</span>}
          </div>
          {errorMessage.firstName && <p className="validation-message">{errorMessage.firstName}</p>}
          {errorMessage.lastName && <p className="validation-message">{errorMessage.lastName}</p>}
          {errorMessage.email && <p className="validation-message">{errorMessage.email}</p>}
          {errorMessage.username && <p className="validation-message">{errorMessage.username}</p>}
          {errorMessage.password && <p className="validation-message">{errorMessage.password}</p>}
          <button type="submit">Sign Up</button>
        </form>
        <p className="link">Already have an account?<Link to="/login">Log in!</Link></p>
      </div>
    </div>
  );
};

export default SignupPage;
