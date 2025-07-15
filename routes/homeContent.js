const express = require('express');
const router = express.Router();
const HomeContent = require('../models/homeContent.model');
const { authenticateAdmin } = require('../middleware/auth');

// Admin Routes - Full CRUD operations

// Create home content (Admin only)
router.post('/admin/create', authenticateAdmin, async (req, res) => {
  try {
    const { title, description, telegramLink, whatsappLink, faqs } = req.body;

    // Validate required fields
    if (!title || !description || !telegramLink || !whatsappLink) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, Telegram link, and WhatsApp link are required'
      });
    }

    // Validate FAQs array
    if (faqs && Array.isArray(faqs)) {
      for (const faq of faqs) {
        if (!faq.question || !faq.answer) {
          return res.status(400).json({
            success: false,
            message: 'Each FAQ must have both question and answer'
          });
        }
      }
    }

    const homeContent = new HomeContent({
      title,
      description,
      telegramLink,
      whatsappLink,
      faqs: faqs || [],
      createdBy: req.user.userId
    });

    await homeContent.save();

    res.status(201).json({
      success: true,
      message: 'Home content created successfully',
      data: homeContent
    });
  } catch (error) {
    console.error('Error creating home content:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all home content (Admin only)
router.get('/admin/all', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const homeContents = await HomeContent.find(query)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await HomeContent.countDocuments(query);

    res.json({
      success: true,
      data: homeContents,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching home content:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single home content by ID (Admin only)
router.get('/admin/:id', authenticateAdmin, async (req, res) => {
  try {
    const homeContent = await HomeContent.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!homeContent) {
      return res.status(404).json({
        success: false,
        message: 'Home content not found'
      });
    }

    res.json({
      success: true,
      data: homeContent
    });
  } catch (error) {
    console.error('Error fetching home content:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update home content (Admin only)
router.put('/admin/:id', authenticateAdmin, async (req, res) => {
  try {
    const { title, description, telegramLink, whatsappLink, faqs, isActive } = req.body;

    const homeContent = await HomeContent.findById(req.params.id);
    if (!homeContent) {
      return res.status(404).json({
        success: false,
        message: 'Home content not found'
      });
    }

    // Validate FAQs array if provided
    if (faqs && Array.isArray(faqs)) {
      for (const faq of faqs) {
        if (!faq.question || !faq.answer) {
          return res.status(400).json({
            success: false,
            message: 'Each FAQ must have both question and answer'
          });
        }
      }
    }

    const updateData = {
      updatedBy: req.user.userId
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (telegramLink !== undefined) updateData.telegramLink = telegramLink;
    if (whatsappLink !== undefined) updateData.whatsappLink = whatsappLink;
    if (faqs !== undefined) updateData.faqs = faqs;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedHomeContent = await HomeContent.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email')
     .populate('updatedBy', 'name email');

    res.json({
      success: true,
      message: 'Home content updated successfully',
      data: updatedHomeContent
    });
  } catch (error) {
    console.error('Error updating home content:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete home content (Admin only)
router.delete('/admin/:id', authenticateAdmin, async (req, res) => {
  try {
    const homeContent = await HomeContent.findById(req.params.id);
    if (!homeContent) {
      return res.status(404).json({
        success: false,
        message: 'Home content not found'
      });
    }

    await HomeContent.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Home content deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting home content:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Public Routes - Read only

// Get active home content (Public)
router.get('/public/active', async (req, res) => {
  try {
    const homeContent = await HomeContent.findOne({ isActive: true })
      .select('-createdBy -updatedBy -__v')
      .sort({ updatedAt: -1 });

    if (!homeContent) {
      return res.status(404).json({
        success: false,
        message: 'No active home content found'
      });
    }

    res.json({
      success: true,
      data: homeContent
    });
  } catch (error) {
    console.error('Error fetching active home content:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all home content (Public - read only)
router.get('/public/all', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const homeContents = await HomeContent.find({ isActive: true })
      .select('-createdBy -updatedBy -__v')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await HomeContent.countDocuments({ isActive: true });

    res.json({
      success: true,
      data: homeContents,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching home content:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router; 