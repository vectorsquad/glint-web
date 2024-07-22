import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PomodoroTimer from '../components/PomodoroTimer';
import '../styles/StudyPage.css';
import { AuthContext } from '../context/AuthContext';

interface ICard {
  id: string;
  side_front: string;
  side_back: string;
  quantity_cards_left: number;
  quantity_cards_total: number;
  message: string;
}

interface IDeck {
  _id: string;
  id_user: string;
  name: string;
  cards: ICard[];
}

const StudyPage: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const { user } = useContext(AuthContext);
  const [deck, setDeck] = useState<IDeck | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFront, setIsFront] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

  const goToNextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % (deck?.cards.length || 1));
  };

  const goToPreviousCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + (deck?.cards.length || 1)) % (deck?.cards.length || 1));
  };

  const handleCardClick = () => {
    setIsFront(!isFront);
  }

  const currentCard = deck?.cards[currentCardIndex];

  return (
    <div className="study-page-container">
      {error && <p className="error">{error}</p>}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        deck && currentCard && (
          <>
            <h1>{deck.name}</h1>
            <PomodoroTimer />
            <div className="card-navigation">
              <button onClick={goToPreviousCard}>Previous</button>
              <button onClick={goToNextCard}>Next</button>
            </div>
            <div className="cards-container">
              <div className='card' onClick={handleCardClick}>
                <div className='content'>{isFront ? currentCard.side_front : currentCard.side_back}</div>
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
};

export default StudyPage;
