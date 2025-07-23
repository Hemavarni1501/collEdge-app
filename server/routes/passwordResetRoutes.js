// server/routes/passwordResetRoutes.js
// Updated to use JWT_SECRET from .env

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// --- THIS IS THE FIX ---
// The secret is now securely loaded from your environment variables
const JWT_SECRET = process.env.JWT_SECRET;

// --- STAGE 1: VERIFY USER ---
router.post('/verify-user', async (req, res) => {
  const { email } = req.body; 
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User with that email not found.' });
    }
    res.json({ 
      question: "To verify your identity, what is your username?",
      userId: user._id 
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred.' });
  }
});

// --- STAGE 2: RESET PASSWORD ---
router.post('/reset-password', async (req, res) => {
  const { userId, answer, newPassword } = req.body;
  try {
    if (!userId || !answer || !newPassword) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    if (user.username.toLowerCase() !== answer.toLowerCase()) {
      return res.status(400).json({ error: 'Incorrect answer. Username does not match.' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });
    res.status(200).json({ message: 'Password has been updated successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred.' });
  }
});

module.exports = router;