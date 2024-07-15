import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

interface IDeck {
  _id: string;
  id_user: string;
  name: string;
}

interface FindDeckResponse {
  decks: IDeck[] | null;
  quantity: number;
  message: string;
}

interface JwtPayload {
  sub: string;  // Changed from id to sub
  exp: number;
  iat: number;
}

const Dashboard: React.FC = () => {
  const [decks, setDecks] = useState<IDeck[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  const itemsPerPage = 10;

  const getCookie = useCallback((name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }, []);

  useEffect(() => {
    const token = getCookie('auth');
    console.log('Auth cookie:', token);

    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        console.log('Decoded token:', decodedToken);
        
        if (decodedToken.sub) {
          setUserId(decodedToken.sub);
          console.log('User ID set:', decodedToken.sub);
        } else {
          console.error('Token does not contain a sub field');
          setError('Invalid token structure. Please log in again.');
        }
      } catch (error) {
        console.error('Error decoding JWT:', error);
        setError('Authentication error. Please log in again.');
      }
    } else {
      console.log('No auth cookie found');
      setError('Not authenticated. Please log in.');
    }
  }, [getCookie]);

  const fetchDecks = useCallback(async () => {
    if (!userId) {
      setError('User ID not available. Please log in.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post<FindDeckResponse>(
        '/api/v1/findDeck',
        {
          user_id: userId,
          deck_name: searchTerm
        },
        {
          headers: {
            'Authorization': `Bearer ${getCookie('auth')}`
          }
        }
      );
      setDecks(response.data.decks || []);
    } catch (error) {
      console.error('Error fetching decks:', error);
      setError('Failed to fetch decks. Please try again.');
    }
    setIsLoading(false);
  }, [userId, searchTerm, getCookie]);

  useEffect(() => {
    if (userId) {
      fetchDecks();
    }
  }, [userId, fetchDecks]);

  // ... (rest of the component remains the same)

  return (
    <div>
      <h1>Dashboard</h1>
      {/* ... (rest of the JSX remains the same) */}
    </div>
  );
};

export default Dashboard;