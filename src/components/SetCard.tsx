//TODO:
//1.Turn CreateSetCard into button that Creates Set in database
//2.SetCards should link to Set Page

import React from 'react';
import '../styles/SetCard.css'; 

interface SetCardProps {
  title: string;
  cardCount: number;
}

const SetCard: React.FC<SetCardProps> = ({ title, cardCount }) => {
  return (
    <div className="set-card">
      <div className="set-content">
        <div className="set-title">{title}</div>
        <div className="card-count">{cardCount} cards</div>
      </div>
    </div>
  );
}

export const CreateSetCard: React.FC = () => {
  return (
    <div className="set-card add-card">
      <span>+</span>
      <div className="set-title">Create Set</div>
    </div>
  );
}

export default SetCard;