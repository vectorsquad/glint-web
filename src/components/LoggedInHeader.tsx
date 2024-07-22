// src/components/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container">
        <Link to="/dashboard" className="logo">Glint</Link>
        <nav>
          <Link to="/" className="login-button">Log Out</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
