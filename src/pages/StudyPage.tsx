import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/StudyPage.css';
import { AuthContext } from '../context/AuthContext';

interface ICard {
  _id: string;
  side_front: string;
  side_back: string;
  deck_index: number;
}

interface IDeck {
  _id: string;
  id_user: string;
  name: string;
}

const StudyPage: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const { user } = useContext(AuthContext);
  const [deck, setDeck] = useState<IDeck | null>(null);
  const [cards, setCards] = useState<ICard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFront, setIsFront] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchDeckDetails = async () => {
    setIsLoading(true);
    setError('');
    try {
      const deckResponse = await axios.post<IDeck[]>(
        '/api/v1/findDeck',
        { _id: deckId },
        {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        }
      );

      if (deckResponse.data.length > 0) {
        setDeck(deckResponse.data[0]);

        const cardsResponse = await axios.post<ICard[]>(
          '/api/v1/find',
          { id_deck: deckId },
          {
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          }
        );

        setCards(cardsResponse.data);
      } else {
        setError('Deck not found');
      }
    } catch (err) {
      console.error('Error fetching deck and cards:', err);
      setError('Failed to fetch deck and cards. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeckDetails();
  }, [deckId, user.token]);

  const goToNextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const goToPreviousCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
  };

  const handleCardClick = () => {
    setIsFront(!isFront);
  }

  const handleReturnToDashboard = () => {
    navigate('/dashboard');
  }

  const currentCard = cards[currentCardIndex];

  const renderFerrisWheel = () => {
    return (
      <div className="ferris-wheel">
        {cards.map((_, index) => (
          <div 
            key={index} 
            className={`ferris-wheel-dot ${index === currentCardIndex ? 'active' : ''}`}
          ></div>
        ))}
      </div>
    );
  };

  return (
    <div className="study-page-container">
      {error && <p className="error">{error}</p>}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        deck && currentCard && (
          <>
            <h1>{deck.name}</h1>
            <div className="cards-container">
              <div className='card' onClick={handleCardClick}>
                <div className='content'>{isFront ? currentCard.side_front : currentCard.side_back}</div>
              </div>
            </div>
            {renderFerrisWheel()}
            <div className="card-navigation">
              <button onClick={goToPreviousCard}>
                <img src="/previous.png" alt="Previous" className="nav-icon" />
              </button>
              <button onClick={goToNextCard}>
                <img src="/next.png" alt="Next" className="nav-icon" />
              </button>
            </div>
            <button onClick={handleReturnToDashboard} className="return-button">Return to Dashboard</button>
          </>
        )
      )}
    </div>
  );
};

export default StudyPage;