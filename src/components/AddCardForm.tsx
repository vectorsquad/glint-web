// src/components/AddCardForm.tsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface AddCardFormProps {
  deckId: string;
  onCardAdded: () => void;
}

interface ICard {
  _id: string;
  id_deck: string;
  side_front: string;
  side_back: string;
}

const AddCardForm: React.FC<AddCardFormProps> = ({ deckId, onCardAdded }) => {
  const [sideFront, setSideFront] = useState('');
  const [sideBack, setSideBack] = useState('');
  const [cards, setCards] = useState<ICard[]>([]);

  const fetchCards = useCallback(async () => {
    try {
      const response = await axios.post(`/api/v1/find`, { id_deck: deckId });
      setCards(response.data.cards);
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  }, [deckId]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/v1/create', { 
        id_deck: deckId, 
        side_front: sideFront, 
        side_back: sideBack 
      });
      setSideFront('');
      setSideBack('');
      onCardAdded();
      fetchCards();
    } catch (error) {
      console.error('Error adding card:', error);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      await axios.post('/api/v1/delete', { id: cardId });
      fetchCards();
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Front side of the card"
          value={sideFront}
          onChange={(e) => setSideFront(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Back side of the card"
          value={sideBack}
          onChange={(e) => setSideBack(e.target.value)}
          required
        />
        <button type="submit">Add Card</button>
      </form>
      <div className="cards-list">
        {cards.map((card) => (
          <div key={card._id} className="card">
            <div className="card-content">
              <p><strong>Front:</strong> {card.side_front}</p>
              <p><strong>Back:</strong> {card.side_back}</p>
            </div>
            <button onClick={() => handleDeleteCard(card._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddCardForm;
