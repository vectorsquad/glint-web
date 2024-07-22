import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PomodoroTimer from '../components/PomodoroTimer';
import Modal from '../components/Modal';
import '../styles/StudyPage.css';
import { AuthContext } from '../context/AuthContext';

interface ICard {
  _id: string;
  question: string;
  answer: string;
}

interface IDeck {
  _id: string;
  name: string;
  cards: ICard[];
}

const StudyPage: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const { user } = useContext(AuthContext);
  const [deck, setDeck] = useState<IDeck | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<ICard | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    const fetchDeck = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await axios.post('/api/v1/findDeck', 
          { _id: deckId },
          {
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          }
        );
        setDeck(response.data[0]); // The API returns an array, so we need to get the first item
      } catch (error) {
        console.error('Error fetching deck:', error);
        setError('Failed to fetch deck. Please try again.');
      }
      setIsLoading(false);
    };

    fetchDeck();
  }, [deckId, user.token]);

  const openCreateModal = () => {
    setEditingCard(null);
    setQuestion('');
    setAnswer('');
    setIsModalOpen(true);
  };

  const openEditModal = (card: ICard) => {
    setEditingCard(card);
    setQuestion(card.question);
    setAnswer(card.answer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveCard = async () => {
    if (!deck) return;

    if (editingCard) {
      try {
        const response = await axios.put(`/api/v1/editCard/${editingCard._id}`, {
          question,
          answer
        });

        const updatedCards = deck.cards.map(card =>
          card._id === editingCard._id ? response.data : card
        );

        setDeck({ ...deck, cards: updatedCards });
      } catch (error) {
        console.error('Error editing card:', error);
        setError('Failed to edit card. Please try again.');
      }
    } else {
      try {
        const response = await axios.post(`/api/v1/createCard`, {
          deckId: deck._id,
          question,
          answer
        });

        setDeck({ ...deck, cards: [...deck.cards, response.data] });
      } catch (error) {
        console.error('Error creating card:', error);
        setError('Failed to create card. Please try again.');
      }
    }

    closeModal();
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!deck) return;

    try {
      await axios.delete(`/api/v1/deleteCard/${cardId}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      const updatedCards = deck.cards.filter(card => card._id !== cardId);
      setDeck({ ...deck, cards: updatedCards });
    } catch (error) {
      console.error('Error deleting card:', error);
      setError('Failed to delete card. Please try again.');
    }
  };

  const goToNextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % (deck?.cards.length || 1));
  };

  const goToPreviousCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + (deck?.cards.length || 1)) % (deck?.cards.length || 1));
  };

  return (
    <div className="study-page-container">
      {error && <p className="error">{error}</p>}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        deck && (
          <>
            <h1>{deck.name}</h1>
            <PomodoroTimer />
            <button onClick={openCreateModal}>Add Card</button>
            <div className="card-navigation">
              <button onClick={goToPreviousCard}>Previous</button>
              <button onClick={goToNextCard}>Next</button>
            </div>
            <div className="cards-container">
              {deck.cards.length > 0 && (
                <div className="card">
                  <div className="question">{deck.cards[currentCardIndex].question}</div>
                  <div className="answer">{deck.cards[currentCardIndex].answer}</div>
                  <button onClick={() => openEditModal(deck.cards[currentCardIndex])}>Edit</button>
                  <button onClick={() => handleDeleteCard(deck.cards[currentCardIndex]._id)}>Delete</button>
                </div>
              )}
            </div>
          </>
        )
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveCard}
      >
        <div>
          <label>Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>
        <div>
          <label>Answer</label>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default StudyPage;
