// src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/App.css';
import Header from '../components/Header';

const HomePage: React.FC = () => {
  return (
    <div className="home">
      <Header />
      <h1>Glint</h1>
      <h4 style={{ color: '#828282' }}>A tool kit for all students to enhance their learning.</h4>
      <img src="/logo.jpg" alt="Glint Logo" className="logo" style={{ maxWidth: '100%', height: 'auto' }} />
      <br></br>
      <br></br>
      <br></br>
      <div className="link">
        <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
};


export default HomePage;
