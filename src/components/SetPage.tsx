import React from 'react';
import { useParams } from 'react-router-dom';

const SetPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1>Set {id}</h1>
      <button>Start Studying</button>
      <button>Edit Set</button>
      <button>Add New Card</button>
    </div>
  );
}

export default SetPage;
