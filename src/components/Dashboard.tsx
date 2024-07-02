import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <input type="text" placeholder="Search..." />
      <div>
        <h2>Your Sets</h2>
        <ul>
          <li><a href="/set/1">Set 1</a></li>
          <li><a href="/set/2">Set 2</a></li>
          <li><a href="/set/3">Set 3</a></li>
        </ul>
        <button>Add New Set</button>
        <button>View All Sets</button>
      </div>
    </div>
  );
}

export default Dashboard;
