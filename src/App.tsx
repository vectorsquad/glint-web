// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/HomePage';
import AboutUs from './pages/AboutUs';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import StudyPage from './pages/StudyPage';
import './styles/App.css';
import { AuthProvider } from './context/AuthContext';
import InitialAuthCheck from './components/InitialAuthCheck';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<InitialAuthCheck />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/study/:deckId" element={<StudyPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
