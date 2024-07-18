// src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/App.css';
import Header from '../components/Header';

const HomePage: React.FC = () => {
  return (
    <div className="home">
      <Header />
      <h1>Glint</h1>
      <h4 style={{ color: '#828282' }}>A tool kit for all students to enhance their learning.</h4>
      <img src="/logo.jpg" alt="Glint Logo" className="logo" style={{ maxWidth: '100%', height: 'auto' }} />
      <br></br>
      <br></br>
      <br></br>
      <h2 style={{ textAlign: 'left' }}>What is Glint?</h2>
      <h4 style={{ textAlign: 'left' }}>We are offering a completely free and open-source software to support students who are looking to better memorize information and improve study routines. Applications like Anki, while amazing, lack a modern feeling and solve one problem very well, memorization via flashcards. However, we are looking to improve multiple aspects of the learning process for students.</h4>
      <h4 style={{ textAlign: 'left' }}>We take advantage of the Pomodoro technique to enhance productivity and focus. Our web app includes a built-in Pomodoro timer, allowing students to break their study sessions into manageable intervals. This method helps to maintain concentration, reduce burnout, and ensure efficient use of study time. By integrating this technique, we aim to create a more holistic and effective learning experience for students.</h4>
      <div className="link">
        <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
};


export default HomePage;
