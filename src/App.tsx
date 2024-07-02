// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Header from './components/Header';
import './styles/App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/about" element={<div>About Us</div>} /> {/* Placeholder for About Us */}
          <Route path="/dashboard" element={<div>Dashboard</div>} /> {/* Temporary dashboard */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
