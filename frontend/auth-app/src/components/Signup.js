import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const Signup = () => {
    const [file, setFile] = useState(null);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // New state for message type
    const [isUploading, setIsUploading] = useState(false);
    const baseUrl = process.env.REACT_APP_BASE_API;
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile && !selectedFile.type.startsWith('image/')) {
            setMessage('Please select an image file.');
            setMessageType('error');
            return;
        }

        if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
            setMessage('File size must be less than 5MB.');
            setMessageType('error');
            return;
        }

        setFile(selectedFile);
        setMessage('');
        setMessageType('');
    };

    const handleUpload = async (event) => {
        event.preventDefault();

        if (!email || !name || !password || !confirmPassword) {
            setMessage('Please fill out all fields.');
            setMessageType('error');
            return;
        }

        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            setMessageType('error');
            return;
        }

        setIsUploading(true);
        try {
            let uniqueFilename = '';
            let contentType = '';

            if (file) {
                uniqueFilename = `${uuidv4()}_${file.name}`;
                contentType = file.type;
            }

            const response = await axios.post(`${baseUrl}/signup`, {
                filename: uniqueFilename,
                contentType,
                email,
                name,
                password,
            });

            if (file) {
                const { uploadURL } = response.data;
                await axios.put(uploadURL, file, {
                    headers: { 'Content-Type': file.type },
                });
            }

            setMessage('Signup successful! Redirecting to login...');
            setMessageType('success'); // Set success message
            clearFields();
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            console.error('Error uploading file:', error);
            setMessage('Signup failed. Please try again.');
            setMessageType('error');
        } finally {
            setIsUploading(false);
        }
    };

    const clearFields = () => {
        setFile(null);
        setEmail('');
        setName('');
        setPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="signup-container form-container">
            <form onSubmit={handleUpload} className="form-content">
                <h2>Create Account</h2>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="file">Profile Image (Optional)</label>
                    <input
                        id="file"
                        type="file"
                        onChange={handleFileChange}
                        disabled={isUploading}
                    />
                </div>
                <button type="submit" disabled={isUploading}>
                    {isUploading ? 'Signing Up...' : 'Sign Up and Upload'}
                </button>
                {message && <p className={messageType}>{message}</p>}
                <p>
                    Already have an account?{' '}
                    <button type="button" onClick={() => navigate('/login')}>
                        Login
                    </button>
                </p>
            </form>
        </div>
    );
};

export default Signup;
