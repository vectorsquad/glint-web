//TODO:
//1. Change the SetCards to dynamically load 3 most recent from database
//2. View all sets shows all sets
//3. Header needs searchbar and Login Button changed to Sign Out


import React from 'react';
import SetCard, { CreateSetCard } from '../components/SetCard';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <main>
        <h1>Your Sets</h1>
        <div className="sets-row">
          <SetCard title="Set 1" cardCount={14} />
          <SetCard title="Set 2" cardCount={4} />
          <SetCard title="Set 3" cardCount={7} />
          <CreateSetCard />
          
        </div>
        <a href="#" className="view-all-sets"><u>View all sets</u></a>
      </main>
    </div>
  );
}

export default Dashboard;
