// src/components/Modal.tsx
import React, { useState } from 'react';
import '../styles/Modal.css';

interface ICard {
  front: string;
  back: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, cards: ICard[]) => void;
  children?: React.ReactNode; // Accept children
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, children }) => {
  const [name, setName] = useState('');
  const [cards, setCards] = useState<ICard[]>([
    { front: '', back: '' },
    { front: '', back: '' },
  ]);
  const [error, setError] = useState('');

  const handleCardChange = (index: number, field: 'front' | 'back', value: string) => {
    const updatedCards = [...cards];
    updatedCards[index][field] = value;
    setCards(updatedCards);
  };

  const addCard = () => {
    setCards([...cards, { front: '', back: '' }]);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Set name is required.');
      return;
    }

    const filledCards = cards.filter(card => card.front.trim() && card.back.trim());
    if (filledCards.length < 2) {
      setError('At least 2 cards with both front and back filled are required.');
      return;
    }

    onSave(name, cards);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Create New Set</h2>
          <span className="close" onClick={onClose}>
            &times;
          </span>
        </div>
        <div className="modal-body">
          <div className="set-name">
            <label htmlFor="set-name">Set Name</label>
            <input
              id="set-name"
              type="text"
              placeholder="Enter a title"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <div className="cards-container">
            {cards.map((card, index) => (
              <div key={index} className="card-input">
                <h3>Card {index + 1}</h3>
                <div className="input-pair">
                  <label htmlFor={`front-${index}`}>Front</label>
                  <textarea
                    id={`front-${index}`}
                    placeholder="Enter term"
                    value={card.front}
                    onChange={(e) => handleCardChange(index, 'front', e.target.value)}
                    required
                    className="card-input-textarea"
                  />
                  <label htmlFor={`back-${index}`}>Back</label>
                  <textarea
                    id={`back-${index}`}
                    placeholder="Enter definition"
                    value={card.back}
                    onChange={(e) => handleCardChange(index, 'back', e.target.value)}
                    required
                    className="card-input-textarea"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="button-container">
            <button onClick={addCard} className="add-card-btn">Add Card</button>
            <button onClick={handleSubmit} className="create-btn">Create</button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
