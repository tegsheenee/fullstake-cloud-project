import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const baseUrl = process.env.REACT_APP_BASE_API; // Replace with your base URL

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setMessage('Please fill in all fields.');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const response = await axios.post(`${baseUrl}/login`, { email, password });
            const { token, profileImageUrl } = response.data;

            // Store token and profile image URL in localStorage
            localStorage.setItem('authToken', token);
            localStorage.setItem('profileImageUrl', profileImageUrl);

            setLoading(false);

            // Set authentication status to true in the parent component
            setIsAuthenticated(true); // Update authentication state

            // Redirect to profile page immediately after login
            navigate('/profile', { replace: true });
        } catch (error) {
            console.error('Login error:', error);
            setMessage('Login failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogin} className="form-container">
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </button>
            {message && <p>{message}</p>}
            <p>Don't have an account? <button type="button" onClick={() => navigate('/signup')}>Sign Up</button></p>
        </form>
    );
};

export default Login;