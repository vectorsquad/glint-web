import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const VerifyEmail: React.FC = () => {
  const [verificationStatus, setVerificationStatus] = useState<string>('Verifying...');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');

      if (!code) {
        setVerificationStatus('Invalid verification link');
        return;
      }

      try {
        const response = await axios.get(`/api/v1/verify?code=${code}`);
        if (response.data.success) {
          setVerificationStatus('Email verified successfully!');
          // Redirect to the main page or dashboard after 3 seconds
          setTimeout(() => navigate('/dashboard'), 3000);
        } else {
          setVerificationStatus(response.data.message || 'Email verification failed. Please try again.');
        }
      } catch (error) {
        setVerificationStatus('An error occurred during verification. Please try again.');
      }
    };

    verifyEmail();
  }, [location, navigate]);

  return (
    <div className="verify-email-container">
      <h1>Email Verification</h1>
      <p>{verificationStatus}</p>
    </div>
  );
};

export default VerifyEmail;