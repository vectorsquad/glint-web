import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/EditDeckPage.css';

interface IDeck {
  _id: string;
  name: string;
  id_user: string;
}

interface ICard {
  _id: string;
  id_deck: string;
  side_front: string;
  side_back: string;
  deck_index: number;
}

interface ErrorResponse {
  message: string;
}

const EditDeckPage: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const [deck, setDeck] = useState<IDeck | null>(null);
  const [cards, setCards] = useState<ICard[]>([]);
  const [newName, setNewName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDeckAndCards = async () => {
      try {
        const deckResponse = await axios.post<IDeck[]>(
          '/api/v1/findDeck',
          { _id: deckId }
        );

        if (deckResponse.data.length > 0) {
          setDeck(deckResponse.data[0]);
          setNewName(deckResponse.data[0].name);

          const cardsResponse = await axios.post<ICard[]>(
            '/api/v1/find',
            { id_deck: deckId }
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

    fetchDeckAndCards();
  }, [deckId]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  const handleDeckNameBlur = async () => {
    try {
      const response = await axios.post<void | ErrorResponse>(
        '/api/v1/updateDeck',
        { _id: deckId, name: newName }
      );

      if (response.data && (response.data as ErrorResponse).message) {
        setError((response.data as ErrorResponse).message);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setError('Deck not found');
      } else {
        console.error('Error updating deck:', err);
        setError('Failed to update deck. Please try again.');
      }
    }
  };

  const handleCardChange = (index: number, field: 'side_front' | 'side_back', value: string) => {
    const updatedCards = [...cards];
    updatedCards[index][field] = value;
    setCards(updatedCards);
  };

  const handleCardUpdate = async (card: ICard) => {
    try {
      await axios.post<void | ErrorResponse>(
        '/api/v1/update',
        {
          _id: card._id,
          id_deck: deckId,
          side_front: card.side_front,
          side_back: card.side_back
        }
      );

      setCards(cards.map(c => c._id === card._id ? card : c));
    } catch (err) {
      console.error('Error updating card:', err);
      setError('Failed to update card. Please try again.');
    }
  };

  const deleteCard = async (index: number) => {
    const cardId = cards[index]._id;
    if (cards.length > 2) {
      try {
        await axios.post<void | ErrorResponse>(
          '/api/v1/delete',
          { _id: cardId }
        );
        const updatedCards = cards.filter((_, i) => i !== index);
        setCards(updatedCards);
      } catch (err) {
        console.error('Error deleting card:', err);
        setError('Failed to delete card. Please try again.');
      }
    } else {
      setError('At least 2 cards are required.');
    }
  };

  const addCard = () => {
    setCards([...cards, { _id: `${Date.now()}`, id_deck: deckId!, side_front: '', side_back: '', deck_index: cards.length }]);
  };

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useEffect(() => {
    const textareas = document.querySelectorAll('.card-input-textarea');
    textareas.forEach(textarea => adjustTextareaHeight(textarea as HTMLTextAreaElement));
  }, [cards]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!deck) return <div>Deck not found</div>;

  return (
    <div className="edit-deck-container">
      <h1>Edit Deck</h1>
      <div className="set-name">
        <label htmlFor="set-name">Deck Name</label>
        <input
          id="set-name"
          type="text"
          placeholder="Enter a title"
          value={newName}
          onChange={handleNameChange}
          onBlur={handleDeckNameBlur}
          required
        />
      </div>
      {error && <p className="error">{error}</p>}
      <div className="cards-container">
        {cards.map((card, index) => (
          <div key={index} className="card-input">
            <img
              src="/delete.png"
              alt="Delete"
              className="delete-icon"
              onClick={() => deleteCard(index)}
            />
            <h3>Card {index + 1}</h3>
            <div className="input-pair">
              <label htmlFor={`front-${index}`}>Front</label>
              <textarea
                id={`front-${index}`}
                placeholder="Enter term"
                value={card.side_front}
                onChange={(e) => handleCardChange(index, 'side_front', e.target.value)}
                onBlur={() => handleCardUpdate(card)}
                required
                className="card-input-textarea"
                onInput={(e) => adjustTextareaHeight(e.target as HTMLTextAreaElement)}
              />
              <label htmlFor={`back-${index}`}>Back</label>
              <textarea
                id={`back-${index}`}
                placeholder="Enter definition"
                value={card.side_back}
                onChange={(e) => handleCardChange(index, 'side_back', e.target.value)}
                onBlur={() => handleCardUpdate(card)}
                required
                className="card-input-textarea"
                onInput={(e) => adjustTextareaHeight(e.target as HTMLTextAreaElement)}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="button-container">
        <button onClick={addCard} className="add-card-btn">+ Add Card</button>
        <button onClick={() => navigate('/dashboard')} className="create-btn">Return to Dashboard</button>
      </div>
    </div>
  );
};

export default EditDeckPage;
