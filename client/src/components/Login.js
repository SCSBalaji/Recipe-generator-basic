import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('/auth/user', {
          credentials: 'include'
        });
        const data = await response.json();
        
        if (data.authenticated) {
          // User is already logged in, redirect to home
          navigate('/home');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth route
    window.location.href = '/auth/google';
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="emoji">🍳</div>
        <h1>Recipe Generator</h1>
        <p>
          Welcome to the AI-powered Recipe Generator!<br />
          Enter your ingredients and let AI create delicious recipes for you.
        </p>
        <button className="google-login-btn" onClick={handleGoogleLogin}>
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google logo"
          />
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
