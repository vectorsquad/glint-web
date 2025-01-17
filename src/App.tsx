// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Homepage from './pages/HomePage';
import AboutUs from './pages/AboutUs';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import StudyPage from './pages/StudyPage';
import EditDeckPage from './pages/EditDeckPage';
import './styles/App.css';
import { AuthProvider } from './context/AuthContext';
import InitialAuthCheck from './components/InitialAuthCheck';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SendPassword from './pages/SendPasswordPage'
import VerifyEmail from './pages/VerifyEmail';

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
            <Route path="/edit/:deckId" element={<EditDeckPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/updatePassword" element={<ResetPasswordPage/>} />
            <Route path="/sendPassword" element={<SendPassword />} />
            <Route path="/verify" element={<VerifyEmail />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
