import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/App.css';
import Header from '../components/Header';

const HomePage: React.FC = () => {
  return (
    <div className="home">
      <Header />
      <div className="content">
        <img src="/logo.jpg" alt="Glint Logo" className="main-logo" />
        <h3 className="subtitle">A tool kit for all students to enhance their learning</h3>
        <div className="link">
          <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
