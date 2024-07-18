// src/pages/AboutUs.tsx
import React from 'react';
import Header from '../components/Header';
import '../styles/AboutUs.css';

const AboutUs: React.FC = () => {
  return (
    <div>
      <Header />
      <div className="AboutUs">
        <h1>About Us</h1>
        <a href="https://github.com/vectorsquad" target="_blank" rel="noopener noreferrer">
          <img src="/githubImages/github.png" alt="Github Logo" className="profile-pic" style={{ maxWidth: '40%' }} />
        </a>
        <div className="US">
          <div className="person">
            <a href="https://github.com/Alphiel" target="_blank" rel="noopener noreferrer">
              <img src="/githubImages/alan.png" alt="Alan's GitHub" className="profile-pic" />
            </a>
            <h3>Alan (Project Manager)</h3>
          </div>
          <div className="person">
            <a href="https://github.com/thatpix3l" target="_blank" rel="noopener noreferrer">
              <img src="/githubImages/jonathan.png" alt="Jonathan's GitHub" className="profile-pic" />
            </a>
            <h3>Jonathan (Database)</h3>
          </div>
          <div className="person">
            <a href="https://github.com/opoderosojeffao" target="_blank" rel="noopener noreferrer">
              <img src="/githubImages/rodrigo.png" alt="Rodrigo's GitHub" className="profile-pic" />
            </a>
            <h3>Rodrigo (API)</h3>
          </div>
          <div className="person">
            <a href="https://github.com/co719138" target="_blank" rel="noopener noreferrer">
              <img src="/githubImages/corey.png" alt="Corey's GitHub" className="profile-pic" />
            </a>
            <h3>Corey (API)</h3>
          </div>
          <div className="person">
            <a href="https://github.com/j-mckiern" target="_blank" rel="noopener noreferrer">
              <img src="/githubImages/jake.png" alt="Jake's GitHub" className="profile-pic" />
            </a>
            <h3>Jake (Frontend)</h3>
          </div>
          <div className="person">
            <a href="https://github.com/jsimon20" target="_blank" rel="noopener noreferrer">
              <img src="/githubImages/joseph.png" alt="Joseph's GitHub" className="profile-pic" />
            </a>
            <h3>Joseph (Frontend)</h3>
          </div>
          <div className="person">
            <a href="https://github.com/noahi03" target="_blank" rel="noopener noreferrer">
              <img src="/githubImages/noah.png" alt="Noah's GitHub" className="profile-pic" />
            </a>
            <h3>Noah (Frontend)</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
