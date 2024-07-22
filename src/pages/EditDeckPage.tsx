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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post<void | ErrorResponse>(
        '/api/v1/updateDeck',
        { _id: deckId, name: newName }
      );

      if (response.data && (response.data as ErrorResponse).message) {
        setError((response.data as ErrorResponse).message);
      } else {
        navigate('/dashboard');
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

  const handleCardChange = (cardId: string, field: 'side_front' | 'side_back', value: string) => {
    setCards(cards.map(card => 
      card._id === cardId ? { ...card, [field]: value } : card
    ));
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

  const handleCardDelete = async (cardId: string) => {
    try {
      await axios.post<void | ErrorResponse>(
        '/api/v1/delete',
        { _id: cardId }
      );

      setCards(cards.filter(card => card._id !== cardId));
    } catch (err) {
      console.error('Error deleting card:', err);
      setError('Failed to delete card. Please try again.');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!deck) return <div>Deck not found</div>;

  return (
    <div className="edit-deck-container">
      <h1>Edit Deck</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Deck Name:
          <input
            type="text"
            value={newName}
            onChange={handleNameChange}
            required
            className="edit-deck-name-input"
          />
        </label>
        <button type="submit">Update Deck Name</button>
      </form>

      <h2>Cards in this Deck:</h2>
      {cards.length === 0 ? (
        <p>No cards found in this deck.</p>
      ) : (
        <ul className="edit-cards-list">
          {cards.map((card) => (
            <li key={card._id} className="edit-card-item">
              <input
                type="text"
                value={card.side_front}
                onChange={(e) => handleCardChange(card._id, 'side_front', e.target.value)}
                onBlur={() => handleCardUpdate(card)}
                className="edit-card-input"
              />
              <input
                type="text"
                value={card.side_back}
                onChange={(e) => handleCardChange(card._id, 'side_back', e.target.value)}
                onBlur={() => handleCardUpdate(card)}
                className="edit-card-input"
              />
              <button onClick={() => handleCardDelete(card._id)} className="edit-delete-button">Delete</button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate('/dashboard')}>Return to Dashboard</button>
    </div>
  );
};

export default EditDeckPage;
