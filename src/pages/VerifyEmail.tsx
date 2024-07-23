import React from 'react';

const VerifyEmail: React.FC = () => {
  return (
    <div className="verify-email-container" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh' 
    }}>
      <span role="img" aria-label="checkmark" style={{ fontSize: '48px' }}>✅</span>
      <p style={{ fontSize: '24px', marginTop: '20px' }}>Email verified</p>
    </div>
  );
};

export default VerifyEmail;