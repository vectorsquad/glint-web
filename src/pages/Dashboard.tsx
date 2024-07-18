import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Modal from '../components/Modal';
import Header from '../components/LoggedInHeader';
import '../styles/Dashboard.css';
import { useNavigate } from 'react-router-dom';

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
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState<IDeck | null>(null);
  const navigate = useNavigate();

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
        { deck_name: searchTerm },
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

  const handleCreateDeck = async (name: string) => {
    if (!userId) {
      setError('User ID not available. Please log in.');
      return;
    }

    try {
      const response = await axios.post('/api/v1/createDeck', {
        deck_name: name
      }, {
        headers: {
          'Authorization': `Bearer ${getCookie('auth')}`
        }
      });

      setDecks((prevDecks) => [...prevDecks, response.data]);
    } catch (error) {
      console.error('Error creating deck:', error);
      setError('Failed to create deck. Please try again.');
    }
  };

  const handleEditDeck = async (deckId: string, name: string) => {
    if (!userId) {
      setError('User ID not available. Please log in.');
      return;
    }

    try {
      const response = await axios.put(`/api/v1/editDeck/${deckId}`, {
        name
      }, {
        headers: {
          'Authorization': `Bearer ${getCookie('auth')}`
        }
      });

      setDecks((prevDecks) => prevDecks.map((deck) => deck._id === deckId ? response.data : deck));
    } catch (error) {
      console.error('Error editing deck:', error);
      setError('Failed to edit deck. Please try again.');
    }
  };

  const handleDeleteDeck = async (deckId: string) => {
    if (!userId) {
      setError('User ID not available. Please log in.');
      return;
    }

    try {
      await axios.delete(`/api/v1/deleteDeck/${deckId}`, {
        headers: {
          'Authorization': `Bearer ${getCookie('auth')}`
        }
      });

      setDecks((prevDecks) => prevDecks.filter((deck) => deck._id !== deckId));
    } catch (error) {
      console.error('Error deleting deck:', error);
      setError('Failed to delete deck. Please try again.');
    }
  };

  const handleStudyDeck = (deckId: string) => {
    navigate(`/study/${deckId}`);
  };

  const openCreateModal = () => {
    setEditingDeck(null);
    setIsModalOpen(true);
  };

  const openEditModal = (deck: IDeck) => {
    setEditingDeck(deck);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const saveDeck = (name: string) => {
    if (editingDeck) {
      handleEditDeck(editingDeck._id, name);
    } else {
      handleCreateDeck(name);
    }
  };

  const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      fetchDecks();
    }
  };

  return (
    <div>
      <Header />
      <div className="dashboard-container">
        <h1>Dashboard</h1>
        {error && <p className="error">{error}</p>}
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <input 
              type="text" 
              placeholder="Search decks..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              onKeyPress={handleSearchKeyPress}
            />
            <div className="deck-cards-container">
              {decks.length > 0 ? (
                decks.map((deck) => (
                  <div key={deck._id} className="deck-card">
                    <h2>{deck.name}</h2>
                    <button onClick={() => openEditModal(deck)}>Edit</button>
                    <button onClick={() => handleDeleteDeck(deck._id)}>Delete</button>
                    <button onClick={() => handleStudyDeck(deck._id)}>Study</button>
                  </div>
                ))
              ) : (
                <div className="deck-card add-set-card" onClick={openCreateModal}>
                  <span className="plus-icon">+</span>
                  <p>Add Sets</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onSave={saveDeck} 
        initialName={editingDeck ? editingDeck.name : ''}
      />
    </div>
  );
};

export default Dashboard;
