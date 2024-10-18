import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ toggleView }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setMessage('Please fill in all fields.');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const response = await axios.post('https://ynw120kvuh.execute-api.us-east-1.amazonaws.com/k-prod/login', { email, password });
            const { token, profileImageUrl } = response.data; // Ensure this token is in JWT format
            console.log('Token received:', token); // Log the token for debugging
            localStorage.setItem('authToken', token); // Save token in localStorage
            localStorage.setItem('profileImageUrl', profileImageUrl); // Save profile image URL
            navigate('/profile'); // Redirect to profile
        } catch (error) {
            console.error('Login error:', error);
            setMessage('Login failed. Please try again.');
        }
        console.log('Logging in:', { email, password });
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
            <p>Don't have an account? <button type="button" onClick={toggleView}>Sign Up</button></p>
        </form>
    );
};

export default Login;