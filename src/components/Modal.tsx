import React from 'react';
import '../styles/Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void; // Update to accept a string parameter
  initialName?: string;
  children?: React.ReactNode; // Make children optional
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, initialName = '', children }) => {
  const [name, setName] = React.useState(initialName);

  const handleSave = () => {
    onSave(name); // Pass the name to the onSave function
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Deck Name</h2>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        {children}
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default Modal;
