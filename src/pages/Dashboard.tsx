// src/pages/Dashboard.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import Modal from '../components/Modal';
import Header from '../components/LoggedInHeader';
import '../styles/Dashboard.css';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

interface IDeck {
  _id: string;
  id_user: string;
  name: string;
}

interface ICard {
  front: string;
  back: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [decks, setDecks] = useState<IDeck[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const fetchDecks = useCallback(async (searchTerm: string) => {
    if (!user) {
      setError('User ID not available. Please log in.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post<IDeck[]>(
        '/api/v1/findDeck',
        { name: searchTerm },
        {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        }
      );
      console.log('API Response:', response.data); // For debugging
      setDecks(response.data);

      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    } catch (error) {
      console.error('Error fetching decks:', error);
      setError('Failed to fetch decks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchDecks('');
    }
  }, [user, fetchDecks]);

  const handleCreateDeck = async (name: string, cards: ICard[]) => {
    if (!user) {
      setError('User ID not available. Please log in.');
      return;
    }

    try {
      const response = await axios.post('/api/v1/createDeck', {
        name: name
      }, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      const deckId = response.data._id;

      for (const card of cards) {
        await axios.post('/api/v1/create', {
          id_deck: deckId,
          side_front: card.front,
          side_back: card.back
        }, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
      }
      fetchDecks(searchTerm);
    } catch (error) {
      console.error('Error creating deck:', error);
      setError('Failed to create deck. Please try again.');
    }
  };

  const handleEditDeck = (deckId: string) => {
    navigate(`/edit/${deckId}`);
  };

  const handleDeleteDeck = async (deckId: string) => {
    if (!user) {
      setError('User ID not available. Please log in.');
      return;
    }

    const isConfirmed = window.confirm('Are you sure you want to delete this deck?');

    if (isConfirmed) {
      try {
        await axios.post('/api/v1/deleteDeck', {
          _id: deckId
        }, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        fetchDecks(searchTerm);
      } catch (error) {
        console.error('Error deleting deck:', error);
        setError('Failed to delete deck. Please try again.');
      }
    }
  };

  const handleStudyDeck = (deckId: string) => {
    navigate(`/study/${deckId}`);
  };

  const openCreateModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const saveDeck = (name: string, cards: ICard[]) => {
    handleCreateDeck(name, cards);
    closeModal();
  };

  const handleSearchClick = () => {
    fetchDecks(searchTerm);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearchClick();
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
            <div className="search-container">
              <img
                src="/search-interface-symbol.png"
                alt="Search"
                className="search-icon"
              />
              <input 
                type="text" 
                placeholder="Search decks..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                ref={searchInputRef}
              />
            </div>
            <p>{decks.length} decks loaded</p>
            <div className="deck-cards-container">
              {decks.map((deck) => (
                <div key={deck._id} className="deck-card">
                  <h2>{deck.name}</h2>
                  <button onClick={() => handleEditDeck(deck._id)}>Edit</button>
                  <button onClick={() => handleStudyDeck(deck._id)}>Study</button>
                  <button onClick={() => handleDeleteDeck(deck._id)}>Delete</button>
                </div>
              ))}
              <div className="deck-card add-set-card" onClick={openCreateModal}>
                <span className="plus-icon">+</span>
                <p>Create Sets</p>
              </div>
            </div>
          </>
        )}
      </div>
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onSave={saveDeck} 
      />
    </div>
  );
};

export default Dashboard;
