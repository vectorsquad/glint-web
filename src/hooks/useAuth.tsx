// src/hooks/useAuth.ts
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const useAuth = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (context === null) {
      throw new Error('useAuth must be used within an AuthProvider');
    }

    if (context.user === null) {
      navigate('/login');
    }
  }, [context, navigate]);

  return context;
};

export default useAuth;
