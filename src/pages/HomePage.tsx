// src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/App.css';

const HomePage: React.FC = () => {
  return (
    <div className="home">
      <h1>Welcome to Glint</h1>
      <div className="link">
        <Link to="/login">Log In</Link>
        <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
};

export default HomePage;
