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
  id: string;  // Changed from userId to id
  // Add other JWT payload fields if necessary
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
    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        setUserId(decodedToken.id);  // Changed from userId to id
      } catch (error) {
        console.error('Error decoding JWT:', error);
        setError('Authentication error. Please log in again.');
      }
    } else {
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDecks();
  };

  const totalPages = Math.ceil(decks.length / itemsPerPage);
  const paginatedDecks = decks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (!userId) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          placeholder="Search..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <div>
        <h2>Your Sets</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <>
            <ul>
              {paginatedDecks.map((deck) => (
                <li key={deck._id}>
                  <a href={`/set/${deck._id}`}>{deck.name}</a>
                </li>
              ))}
            </ul>
            {decks.length > itemsPerPage && (
              <div>
                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                  Next
                </button>
              </div>
            )}
          </>
        )}
        <button>Add New Set</button>
        <button>View All Sets</button>
      </div>
    </div>
  );
};

export default Dashboard;