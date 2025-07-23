// backend/routes/search.js
// Updated to sort results by most recent.

const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');

// GET /api/search?q=your_query
router.get('/', async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required.' });
    }

    const results = await Resource.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { subjectCode: { $regex: query, $options: 'i' } },
        { resourceType: { $regex: query, $options: 'i' } }
      ],
    })
    .populate('user', 'name') // Keep this to show the user's name
    .sort({ uploadedAt: -1 }); // <-- THIS IS THE FIX!

    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'An error occurred during search.' });
  }
});

module.exports = router;