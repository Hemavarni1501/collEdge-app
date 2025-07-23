// backend/models/Resource.js
// The final, flexible, and correct version.

const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  resourceType: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true // A description should always be required
  },

  // --- THESE FIELDS ARE NOW OPTIONAL ---
  subjectCode: {
    type: String,
    // No longer required, as Events/Info won't have it.
  },
  filename: {
    type: String,
    // Not required for text-only posts
  },
  filePath: {
    type: String,
    // Not required for text-only posts
  },
  
  // --- OPTIONAL FIELDS FOR EVENTS ---
  eventDate: {
    type: Date, 
  },
  location: {
    type: String,
  },
  
  // This field is always present
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('upload', resourceSchema, "uploads");