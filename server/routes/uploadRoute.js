const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Resource = require('../models/Resource');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png', '.gif', '.webp', '.txt', '.csv', '.zip', '.rar'];

const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloudinary_cloud_name' &&
  process.env.CLOUDINARY_API_KEY !== 'your_cloudinary_api_key' &&
  process.env.CLOUDINARY_API_SECRET !== 'your_cloudinary_api_secret';

let upload;

if (isCloudinaryConfigured) {
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
        allowed_formats: ['jpeg', 'png', 'jpg', 'gif', 'webp', 'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'csv', 'zip'],
        resource_type: 'auto',
      },
    });
    upload = multer({ storage: cloudStorage });
    console.log('✅ Cloudinary storage configured');
  } catch (err) {
    console.error('❌ Cloudinary setup failed:', err.message);
    setupLocalStorage();
  }
} else {
  setupLocalStorage();
}

function setupLocalStorage() {
  console.log('📁 Upload mode: Local disk');
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  const localStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
  });
  upload = multer({
    storage: localStorage,
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (ALLOWED_EXTENSIONS.includes(ext)) cb(null, true);
      else cb(new Error('File type not allowed'), false);
    }
  });
}

// POST - Upload
router.post('/', authMiddleware, (req, res) => {
  upload.single('file')(req, res, async (uploadErr) => {
    if (uploadErr) return res.status(400).json({ error: uploadErr.message || 'Upload failed' });
    try {
      const { subjectCode, title, resourceType, description, eventDate, location } = req.body;
      if (!title || !resourceType) return res.status(400).json({ error: 'Title and resource type required' });
      const data = {
        user: req.user.id, title, resourceType,
        description: description || '', subjectCode: subjectCode || '',
        eventDate: eventDate || null, location: location || '',
      };
      if (req.file) {
        if (isCloudinaryConfigured) {
          data.filePath = req.file.path;
          data.filename = req.file.filename;
        } else {
          data.filePath = 'uploads/' + req.file.filename;
          data.filename = req.file.filename;
        }
      }
      await new Resource(data).save();
      res.status(201).json({ message: 'Resource posted successfully!' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save resource' });
    }
  });
});

// GET - All resources
router.get('/', async (req, res) => {
  try {
    const resources = await Resource.find().populate('user', 'name').sort({ uploadedAt: -1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// GET - Serve/view a file by resource ID
router.get('/:id/file', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource || !resource.filePath) return res.status(404).json({ error: 'File not found' });
    if (resource.filePath.startsWith('http')) return res.redirect(resource.filePath);
    const filePath = path.join(__dirname, '..', resource.filePath);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found on disk' });
    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ error: 'Failed to serve file' });
  }
});

// GET - Download a file by resource ID
router.get('/:id/download', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource || !resource.filePath) return res.status(404).json({ error: 'File not found' });
    if (resource.filePath.startsWith('http')) return res.redirect(resource.filePath);
    const filePath = path.join(__dirname, '..', resource.filePath);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found on disk' });
    const downloadName = resource.filename || path.basename(filePath);
    res.download(filePath, downloadName);
  } catch (error) {
    res.status(500).json({ error: 'Failed to download file' });
  }
});

// DELETE - Remove resource
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Not found' });
    if (resource.user.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    if (resource.filePath && !resource.filePath.startsWith('http')) {
      const filePath = path.join(__dirname, '..', resource.filePath);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

module.exports = router;