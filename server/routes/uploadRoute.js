// backend/routes/uploadRoute.js
// FINAL VERSION: Uploads files directly to Cloudinary.

const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Resource = require('../models/Resource');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// --- Cloudinary Configuration ---
// This automatically uses the environment variables you set up on Render
// (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- Configure Multer to use Cloudinary for storage instead of local disk ---
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'coll-edge-uploads', // This will create a folder in your Cloudinary account
    allowed_formats: ['jpeg', 'png', 'jpg', 'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'],
    resource_type: 'auto', // Automatically detect the file type
  },
});

const upload = multer({ storage: storage });


// --- POST Route: Handles resource creation ---
router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const { subjectCode, title, resourceType, description, eventDate, location } = req.body;
    const userId = req.user.id;

    const newResourceData = {
      user: userId,
      title,
      resourceType,
      description,
      subjectCode,
      eventDate,
      location
    };

    // --- KEY CHANGE ---
    // If a file was uploaded, req.file will contain the Cloudinary URL in req.file.path
    if (req.file) {
      newResourceData.filePath = req.file.path; // This is now a full, public URL from Cloudinary
      newResourceData.filename = req.file.filename;
    }

    const newResource = new Resource(newResourceData);
    await newResource.save();
    
    res.status(201).json({ message: 'Resource posted successfully!' });

  } catch (error) {
    console.error('SERVER UPLOAD ERROR:', error); 
    res.status(500).json({ error: 'Failed to upload resource.' });
  }
});


// --- GET Route: Fetches all resources for display (No changes needed) ---
router.get('/', async (req, res) => {
  try {
    const resources = await Resource.find().populate('user', 'name').sort({ uploadedAt: -1 });
    res.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: 'Failed to fetch resources.' });
  }
});


// --- DELETE Route: Deletes a specific resource (No changes needed) ---
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const resourceId = req.params.id;
    const userId = req.user.id;

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found.' });
    }

    if (resource.user.toString() !== userId) {
      return res.status(403).json({ error: 'Forbidden: You can only delete your own resources.' });
    }

    await Resource.findByIdAndDelete(resourceId);
    
    // Note: To delete the file from Cloudinary, you would add specific Cloudinary API delete calls here.
    // For now, this just deletes the database record.

    res.status(200).json({ message: 'Resource deleted successfully.' });

  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ error: 'Failed to delete resource.' });
  }
});


module.exports = router;