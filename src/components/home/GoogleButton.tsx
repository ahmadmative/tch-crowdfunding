// src/components/GoogleLoginButton.js
import React from 'react';

const GoogleLoginButton = () => {
  const handleLogin = () => {
    window.open('http://localhost:5000/auth/google', '_self');
  };

  return (
    <button
      onClick={handleLogin}
      style={{
        backgroundColor: '#4285F4',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
    >
      Login with Google
    </button>
  );
};

export default GoogleLoginButton;