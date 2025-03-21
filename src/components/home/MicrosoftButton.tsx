import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirect handling

const MicrosoftLoginButton = () => {
    const navigate = useNavigate();

    // Extract token from URL after redirect
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            localStorage.setItem('token', token); // Store the token securely
            navigate('/dashboard'); // Redirect to the protected route
        }
    }, []);

    const handleMicrosoftLogin = () => {
        window.location.href = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/auth/microsoft`;
    };

    return (
        <button
            onClick={handleMicrosoftLogin}
            style={{
                backgroundColor: '#2F2F2F',
                color: '#FFFFFF',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
            }}
        >
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                alt="Microsoft Logo"
                style={{ width: '20px', height: '20px' }}
            />
            <span>Login with Microsoft</span>
        </button>
    );
};

export default MicrosoftLoginButton;
