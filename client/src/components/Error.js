import React from 'react';
import { Link } from 'react-router-dom';

const Error = () => {
  return (
    <div className="error-container">
      <div className="error-box">
        <div className="error-icon">😕</div>
        <h1>Authentication Failed</h1>
        <p>
          Oops! Something went wrong during the authentication process. 
          This could happen if you cancelled the login or there was a network issue.
        </p>
        <Link to="/login" className="back-to-login-btn">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default Error;
