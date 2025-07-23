// backend/routes/uploadRoute.js
// The final, unified, and corrected version.

const express = require('express');
const multer = require('multer');
const path = require('path');
const Resource = require('../models/Resource');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// --- Multer Configuration (Stays the same) ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, 'uploads/'); },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });


// --- POST Route: Handles ALL resource creation (files, info, events) ---
router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    // Get all possible fields from the request body
    const { subjectCode, title, resourceType, description, eventDate, location } = req.body;
    const userId = req.user.id;

    // Create the base resource object with data that's always present
    const newResourceData = {
      user: userId,
      title,
      resourceType,
      description,
      subjectCode,
      eventDate,
      location
    };

    // Safely check for an uploaded file and add its data if it exists
    if (req.file && req.file.path) {
      newResourceData.filename = req.file.filename;
      newResourceData.filePath = req.file.path.replace(/\\/g, "/"); // Normalize path
    }

    const newResource = new Resource(newResourceData);
    await newResource.save();
    
    res.status(201).json({ message: 'Resource posted successfully!' });

  } catch (error) {
    console.error('SERVER UPLOAD ERROR:', error); 
    res.status(500).json({ error: 'Failed to upload file and save data.' });
  }
});


// --- GET Route: Fetches all resources for display ---
router.get('/', async (req, res) => {
  try {
    const resources = await Resource.find().populate('user', 'name').sort({ uploadedAt: -1 });
    res.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: 'Failed to fetch resources.' });
  }
});


// --- DELETE Route: Deletes a specific resource ---
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const resourceId = req.params.id;
    const userId = req.user.id;

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found.' });
    }

    // Security check: Only the owner can delete their resource
    if (resource.user.toString() !== userId) {
      return res.status(403).json({ error: 'Forbidden: You can only delete your own resources.' });
    }

    await Resource.findByIdAndDelete(resourceId);
    
    // Optional: Delete the physical file from the server
    // const fs = require('fs');
    // if (resource.filePath) {
    //   fs.unlink(resource.filePath, (err) => {
    //     if (err) console.error("Error deleting physical file:", err);
    //   });
    // }

    res.status(200).json({ message: 'Resource deleted successfully.' });

  } catch (error)
 {
    console.error('Error deleting resource:', error);
    res.status(500).json({ error: 'Failed to delete resource.' });
  }
});


module.exports = router;