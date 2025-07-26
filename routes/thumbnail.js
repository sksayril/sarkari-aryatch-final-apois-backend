const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Thumbnail = require('../models/thumbnail.model');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'public/uploads/thumbnails';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'thumbnail-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// ==================== ADMIN ROUTES ====================

// Create Thumbnail (Admin only)
router.post('/admin', authenticateToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, description, url } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
    }

    // Create new thumbnail
    const thumbnail = new Thumbnail({
      title,
      description: description || '',
      imageUrl: `/uploads/thumbnails/${req.file.filename}`,
      originalFileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      url: url || '',
      createdBy: req.user.userId
    });

    await thumbnail.save();

    const populatedThumbnail = await Thumbnail.findById(thumbnail._id)
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Thumbnail created successfully',
      data: populatedThumbnail
    });
  } catch (error) {
    console.error('Create thumbnail error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get All Thumbnails (Admin only)
router.get('/admin', authenticateToken, isAdmin, async (req, res) => {
  try {
    const thumbnails = await Thumbnail.find({ isActive: true })
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ createdAt: -1 }); // Newest first

    res.json({
      success: true,
      data: thumbnails
    });
  } catch (error) {
    console.error('Get thumbnails error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get Single Thumbnail by ID (Admin only)
router.get('/admin/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    const thumbnail = await Thumbnail.findById(id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!thumbnail) {
      return res.status(404).json({
        success: false,
        message: 'Thumbnail not found'
      });
    }

    res.json({
      success: true,
      data: thumbnail
    });
  } catch (error) {
    console.error('Get thumbnail error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update Thumbnail (Admin only)
router.put('/admin/:id', authenticateToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, url, isActive } = req.body;

    // Validate ObjectId format
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    // Check if thumbnail exists
    const thumbnail = await Thumbnail.findById(id);
    if (!thumbnail) {
      return res.status(404).json({
        success: false,
        message: 'Thumbnail not found'
      });
    }

    // Update fields if provided
    if (title !== undefined) thumbnail.title = title;
    if (description !== undefined) thumbnail.description = description;
    if (url !== undefined) thumbnail.url = url;
    if (isActive !== undefined) thumbnail.isActive = isActive;

    // Handle image update if new file is uploaded
    if (req.file) {
      // Delete old image file if exists
      if (thumbnail.imageUrl && thumbnail.imageUrl !== '/uploads/thumbnails/default.jpg') {
        const oldImagePath = path.join('public', thumbnail.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Update image details
      thumbnail.imageUrl = `/uploads/thumbnails/${req.file.filename}`;
      thumbnail.originalFileName = req.file.originalname;
      thumbnail.fileSize = req.file.size;
      thumbnail.mimeType = req.file.mimetype;
    }

    thumbnail.updatedBy = req.user.userId;
    await thumbnail.save();

    const updatedThumbnail = await Thumbnail.findById(id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    res.json({
      success: true,
      message: 'Thumbnail updated successfully',
      data: updatedThumbnail
    });
  } catch (error) {
    console.error('Update thumbnail error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Delete Thumbnail (Admin only)
router.delete('/admin/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    // Check if thumbnail exists
    const thumbnail = await Thumbnail.findById(id);
    if (!thumbnail) {
      return res.status(404).json({
        success: false,
        message: 'Thumbnail not found'
      });
    }

    // Delete image file from server
    if (thumbnail.imageUrl && thumbnail.imageUrl !== '/uploads/thumbnails/default.jpg') {
      const imagePath = path.join('public', thumbnail.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Soft delete by setting isActive to false
    await Thumbnail.findByIdAndUpdate(id, {
      isActive: false,
      updatedBy: req.user.userId
    });

    res.json({
      success: true,
      message: 'Thumbnail deleted successfully'
    });
  } catch (error) {
    console.error('Delete thumbnail error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ==================== PUBLIC ROUTES ====================

// Get All Thumbnails (Public)
router.get('/', async (req, res) => {
  try {
    const thumbnails = await Thumbnail.find({ isActive: true })
      .select('title description imageUrl url createdAt')
      .sort({ createdAt: -1 }); // Newest first

    res.json({
      success: true,
      data: thumbnails
    });
  } catch (error) {
    console.error('Get public thumbnails error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get Single Thumbnail by ID (Public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    const thumbnail = await Thumbnail.findById(id)
      .select('title description imageUrl url createdAt');

    if (!thumbnail) {
      return res.status(404).json({
        success: false,
        message: 'Thumbnail not found'
      });
    }

    res.json({
      success: true,
      data: thumbnail
    });
  } catch (error) {
    console.error('Get public thumbnail error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Search Thumbnails (Public)
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;

    const thumbnails = await Thumbnail.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ],
      isActive: true
    })
      .select('title description imageUrl url createdAt')
      .sort({ createdAt: -1 }); // Newest first

    res.json({
      success: true,
      data: thumbnails
    });
  } catch (error) {
    console.error('Search thumbnails error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 