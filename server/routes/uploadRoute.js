// backend/routes/uploadRoute.js
// Bulletproof version: Handles Cloudinary errors, falls back gracefully, detailed logging.

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Resource = require('../models/Resource');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// --- Detect if Cloudinary is properly configured ---
const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloudinary_cloud_name' &&
  process.env.CLOUDINARY_API_KEY !== 'your_cloudinary_api_key' &&
  process.env.CLOUDINARY_API_SECRET !== 'your_cloudinary_api_secret';

let upload;

if (isCloudinaryConfigured) {
  // ===== CLOUDINARY MODE =====
  console.log('☁️ Upload mode: Cloudinary');
  try {
    const cloudinary = require('cloudinary').v2;
    const { CloudinaryStorage } = require('multer-storage-cloudinary');

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const cloudStorage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'coll-edge-uploads',
        allowed_formats: ['jpeg', 'png', 'jpg', 'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'],
        resource_type: 'auto',
      },
    });

    upload = multer({ storage: cloudStorage });
    console.log('✅ Cloudinary storage configured successfully');
  } catch (err) {
    console.error('❌ Cloudinary setup failed, falling back to local:', err.message);
    setupLocalStorage();
  }
} else {
  setupLocalStorage();
}

function setupLocalStorage() {
  console.log('📁 Upload mode: Local disk (Cloudinary not configured)');
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const localStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + file.originalname;
      cb(null, uniqueSuffix);
    },
  });

  upload = multer({ storage: localStorage });
}


// --- POST Route: Handles resource creation ---
router.post('/', authMiddleware, (req, res) => {
  // Use upload middleware inline so we can catch its errors
  upload.single('file')(req, res, async (uploadErr) => {
    if (uploadErr) {
      console.error('❌ Multer/Cloudinary upload error:', uploadErr.message);
      return res.status(500).json({
        error: 'File upload failed: ' + uploadErr.message,
      });
    }

    try {
      const { subjectCode, title, resourceType, description, eventDate, location } = req.body;
      const userId = req.user.id;

      // Validate required fields
      if (!title || !resourceType) {
        return res.status(400).json({ error: 'Title and resource type are required.' });
      }

      const newResourceData = {
        user: userId,
        title,
        resourceType,
        description: description || '',
        subjectCode: subjectCode || '',
        eventDate: eventDate || null,
        location: location || '',
      };

      if (req.file) {
        if (isCloudinaryConfigured) {
          // Cloudinary: filePath is the full public URL
          newResourceData.filePath = req.file.path;
          newResourceData.filename = req.file.filename;
          console.log('☁️ File uploaded to Cloudinary:', req.file.path);
        } else {
          // Local disk: filePath is relative path for express.static
          newResourceData.filePath = 'uploads/' + req.file.filename;
          newResourceData.filename = req.file.filename;
          console.log('📁 File saved locally:', newResourceData.filePath);
        }
      }

      const newResource = new Resource(newResourceData);
      await newResource.save();

      console.log('✅ Resource saved to DB:', newResource._id);
      res.status(201).json({ message: 'Resource posted successfully!' });

    } catch (error) {
      console.error('❌ DB save error:', error.message);
      res.status(500).json({ error: 'Failed to save resource: ' + error.message });
    }
  });
});


// --- GET Route: Fetches all resources ---
router.get('/', async (req, res) => {
  try {
    const resources = await Resource.find().populate('user', 'name').sort({ uploadedAt: -1 });
    res.json(resources);
  } catch (error) {
    console.error('❌ Error fetching resources:', error.message);
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

    if (resource.user.toString() !== userId) {
      return res.status(403).json({ error: 'Forbidden: You can only delete your own resources.' });
    }

    await Resource.findByIdAndDelete(resourceId);
    console.log('🗑️ Resource deleted:', resourceId);

    res.status(200).json({ message: 'Resource deleted successfully.' });

  } catch (error) {
    console.error('❌ Error deleting resource:', error.message);
    res.status(500).json({ error: 'Failed to delete resource.' });
  }
});


module.exports = router;
