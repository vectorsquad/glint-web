// src/components/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">Glint</Link>
        <input type="text" placeholder='Search' className="search-bar" />
        <nav>
          <Link to="/about">About Us</Link>
          <Link to="/" className="login-button">Log Out</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
