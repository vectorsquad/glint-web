// src/components/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css'; // Ensure the styles are imported

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">Glint</Link>
        <nav>
          <Link to="/about">About Us</Link>
          <Link to="/login" className="login-button">Log In</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
