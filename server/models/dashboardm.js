// models/Dashboardm.js
// Updated and Corrected Version

const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
  // This is the new, essential field.
  // It tracks which user saved this item.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This refers to your main 'User' model
    required: true
  },
  resource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'upload', // This refers to the 'upload' model (your Resource.js)
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index to ensure a user cannot save the same resource twice.
dashboardSchema.index({ user: 1, resource: 1 }, { unique: true });


module.exports = mongoose.model('Dashboard', dashboardSchema);