import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const VerifyEmail: React.FC = () => {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    const verifyEmail = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');

      if (!code) {
        return;
      }

      try {
        const response = await axios.get(`/api/v1/verify?code=${code}`);
        if (response.data.success) {
          setIsVerified(true);
        }
      } catch (error) {
        console.error('Verification error:', error);
      }
    };

    verifyEmail();
  }, [location]);

  return (
    <div className="verify-email-container">
      {isVerified && (
        <>
          <span role="img" aria-label="checkmark" style={{ fontSize: '48px' }}>✅</span>
          <p>Email verified</p>
        </>
      )}
    </div>
  );
};

export default VerifyEmail;