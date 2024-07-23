// src/components/InitialAuthCheck.tsx
import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Homepage from '../pages/HomePage';
import Dashboard from '../pages/Dashboard';

const InitialAuthCheck: React.FC = () => {
  const { setUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.post('/api/v1/login', {});
        if (response.status === 200) {
          const token = response.data.token || document.cookie;
          setUser({ token });
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, setUser]);

  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner
  }

  return isAuthenticated ? <Dashboard /> : <Homepage />;
};

export default InitialAuthCheck;