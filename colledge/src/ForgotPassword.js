// src/ForgotPassword.js
// Updated to use the Email -> Username verification flow.

import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [stage, setStage] = useState(1);
  const [email, setEmail] = useState(''); // Changed from 'identifier' for clarity
  const [question, setQuestion] = useState('');
  const [userId, setUserId] = useState(null);
  const [answer, setAnswer] = useState(''); // This will now be the username
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // STAGE 1: Find the user by email
  const handleFindUser = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Send the email to the backend
      const res = await axios.post('https://colledge-backend.onrender.com/api/password/verify-user', { email });
      setQuestion(res.data.question);
      setUserId(res.data.userId);
      setStage(2); // Move to the next stage
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred.');
    }
  };

  // STAGE 2: Answer question (username) and reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await axios.post('https://colledge-backend.onrender.com/api/password/reset-password', { userId, answer, newPassword });
      setMessage(res.data.message);
      setStage(3);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred.');
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "500px" }}>
      <h2 className="text-center text-info mb-4">Reset Password</h2>

      {/* --- STAGE 1 FORM --- */}
      {stage === 1 && (
        <form onSubmit={handleFindUser}>
          <p className="text-center text-light mb-4">Enter your account's email address to begin.</p>
          <div className="mb-3">
            <label className="form-label text-light">Email Address:</label>
            <input type="email" className="form-control input-neon" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-neon w-100">Find Account</button>
        </form>
      )}

      {/* --- STAGE 2 FORM --- */}
      {stage === 2 && (
        <form onSubmit={handleResetPassword}>
          <p className="text-center text-light mb-4">Answer your security question to continue.</p>
          <div className="mb-3">
            <label className="form-label text-light">{question}</label>
            <input type="text" placeholder="Your Username" className="form-control input-neon" value={answer} onChange={(e) => setAnswer(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label text-light">New Password:</label>
            <input type="password" placeholder="Enter new password" className="form-control input-neon" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-neon w-100">Reset Password</button>
        </form>
      )}

      {/* --- STAGE 3 (MESSAGES) --- */}
      {stage === 3 && (
        <div className="text-center">
          <p className="mt-3 text-success">{message}</p>
          <p>Redirecting you to the login page...</p>
        </div>
      )}

      {error && <p className="mt-3 text-danger text-center">{error}</p>}
      <p className="text-center mt-3">
        <Link to="/login">Back to Login</Link>
      </p>
    </div>
  );
}