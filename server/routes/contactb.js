// backend/routes/contactb.js
// Updated and corrected version

const express = require('express');
const router = express.Router();
const Contact = require('../models/contactm'); // Use our new model

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const newSubmission = new Contact({ name, email, subject, message });
    await newSubmission.save();

    res.status(201).json({ message: 'Your message has been sent successfully!' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

module.exports = router;