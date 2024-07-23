import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
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

  const fetchDeckDetails = async () => {
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
      setError('Failed to fetch deck details. Please try again.');
    }
    setIsLoading(false);
  };

  const fetchNextCard = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/v1/runApp', 
        { id: user.id, deckId },
        {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        }
      );
      const card: ICard = response.data;
      if (card.message.includes("no more cards remaining")) {
        setError(card.message);
      } else {
        setCards((prevCards) => [...prevCards, card]);
      }
    } catch (error) {
      console.error('Error fetching card:', error);
      setError('Failed to fetch card. Please try again.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDeckDetails();
    fetchNextCard();
  }, [deckId, user.token]);

  const goToNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex((prevIndex) => prevIndex + 1);
    } else {
      fetchNextCard();
    }
  };

  const goToPreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleCardClick = () => {
    setIsFront(!isFront);
  }

  const currentCard = cards[currentCardIndex];

  return (
    <div className="study-page-container">
      {error && <p className="error">{error}</p>}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        deck && currentCard && (
          <>
            <h1>{deck.name}</h1>
            <div className="card-navigation">
              <button onClick={goToPreviousCard} disabled={currentCardIndex === 0}>Previous</button>
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
