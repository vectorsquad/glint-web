import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const VerifyEmail: React.FC = () => {
  const [verificationStatus, setVerificationStatus] = useState<string>('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const status = searchParams.get('status');

    if (status === 'success') {
      setVerificationStatus('Your email has been successfully verified!');
      // Redirect to the main page or dashboard after 5 seconds
      setTimeout(() => navigate('/dashboard'), 5000);
    } else {
      setVerificationStatus('Email verification failed. Please try again or contact support.');
    }
  }, [location, navigate]);

  return (
    <div className="verify-email-container">
      <h1>Email Verification</h1>
      <p>{verificationStatus}</p>
      {verificationStatus.includes('successfully') && (
        <p>You will be redirected to the dashboard in a few seconds...</p>
      )}
      {!verificationStatus.includes('successfully') && (
        <p>Please check your email and try the verification link again.</p>
      )}
    </div>
  );
};

export default VerifyEmail;