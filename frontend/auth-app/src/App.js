import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Profile from './components/Profile';
import './App.css'; // Import your CSS file

const App = () => {
  const [isSignup, setIsSignup] = useState(true);

  const toggleView = () => {
    setIsSignup((prev) => !prev);
  };

  const isAuthenticated = () => {
    return localStorage.getItem('authToken') !== null;
  };

  return (
    <div className="App">
      <h1>{isSignup ? 'Sign Up' : 'Login'}</h1>
      <Routes>
        <Route path="/" element={isAuthenticated() ? <Navigate to="/profile" /> : isSignup ? <Signup toggleView={toggleView} /> : <Login toggleView={toggleView} />} />
        <Route path="/profile" element={isAuthenticated() ? <Profile /> : <Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;