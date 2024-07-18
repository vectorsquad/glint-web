// Dashboard.tsx (Frontend)
import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import Modal from '../components/Modal';
import Header from '../components/LoggedInHeader';
import AddCardForm from '../components/AddCardForm';
import '../styles/Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

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

const Dashboard: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [decks, setDecks] = useState<IDeck[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState<IDeck | null>(null);
  const [selectedDeck, setSelectedDeck] = useState<IDeck | null>(null);
  const navigate = useNavigate();

  const fetchDecks = useCallback(async () => {
    if (!user) {
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
            'Authorization': `Bearer ${user.token}`
          }
        }
      );
      setDecks(response.data.decks || []);
    } catch (error) {
      console.error('Error fetching decks:', error);
      setError('Failed to fetch decks. Please try again.');
    }
    setIsLoading(false);
  }, [user, searchTerm]);

  useEffect(() => {
    if (user) {
      fetchDecks();
    }
  }, [user, fetchDecks]);

  const handleCreateDeck = async (name: string) => {
    if (!user) {
      setError('User ID not available. Please log in.');
      return;
    }

    try {
      const response = await axios.post('/api/v1/createDeck', {
        deck_name: name
      }, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      setDecks((prevDecks) => [...prevDecks, response.data]);
    } catch (error) {
      console.error('Error creating deck:', error);
      setError('Failed to create deck. Please try again.');
    }
  };

  const handleEditDeck = async (deckId: string, name: string) => {
    if (!user) {
      setError('User ID not available. Please log in.');
      return;
    }

    try {
      const response = await axios.put(`/api/v1/editDeck/${deckId}`, {
        name
      }, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      setDecks((prevDecks) => prevDecks.map((deck) => deck._id === deckId ? response.data : deck));
    } catch (error) {
      console.error('Error editing deck:', error);
      setError('Failed to edit deck. Please try again.');
    }
  };

  const handleDeleteDeck = async (deckId: string) => {
    if (!user) {
      setError('User ID not available. Please log in.');
      return;
    }

    try {
      await axios.post('/api/v1/deleteDeck', {
        id: deckId
      }, {
        headers: {
          'Authorization': `Bearer ${user.token}`
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

  const handleCardAdded = () => {
    fetchDecks();
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
                    <button onClick={() => setSelectedDeck(deck)}>Add Card</button>
                  </div>
                ))
              ) : (
                <div className="deck-card add-set-card" onClick={openCreateModal}>
                  <span className="plus-icon">+</span>
                  <p>Add Sets</p>
                </div>
              )}
            </div>
            {selectedDeck && (
              <div className="add-card-form">
                <h2>Add Card to {selectedDeck.name}</h2>
                <AddCardForm deckId={selectedDeck._id} onCardAdded={handleCardAdded} />
              </div>
            )}
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
