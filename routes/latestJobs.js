const express = require('express');
const router = express.Router();
const LatestJobs = require('../models/latestJobs.model');
const { authenticateAdmin } = require('../middleware/auth');

// Admin Routes - Full CRUD operations

// Create Latest Job (Admin only)
router.post('/admin/create', authenticateAdmin, async (req, res) => {
  try {
    const { 
      category, 
      metaTitle, 
      metaDescription, 
      metaTags, 
      keywords, 
      contentTitle, 
      contentDescription 
    } = req.body;

    // Validate required fields
    if (!category || !metaTitle || !metaDescription || !contentTitle || !contentDescription) {
      return res.status(400).json({
        success: false,
        message: 'Category, meta title, meta description, content title, and content description are required'
      });
    }

    // Validate category
    const validCategories = ['Results', 'AdmitCards', 'AnswerKey', 'Syllabus', 'Admission', 'Importance','LatestJobs'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category. Must be one of: Results, AdmitCards, AnswerKey, Syllabus, Admission, Importance'
      });
    }

    const latestJob = new LatestJobs({
      category,
      metaTitle,
      metaDescription,
      metaTags: metaTags || [],
      keywords: keywords || [],
      contentTitle,
      contentDescription,
      createdBy: req.user.userId
    });

    await latestJob.save();

    res.status(201).json({
      success: true,
      message: 'Latest job created successfully',
      data: latestJob
    });
  } catch (error) {
    console.error('Error creating latest job:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all latest jobs (Admin only)
router.get('/admin/all', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    
    // Add category filter
    if (category) {
      query.category = category;
    }
    
    // Add search filter
    if (search) {
      query.$or = [
        { metaTitle: { $regex: search, $options: 'i' } },
        { contentTitle: { $regex: search, $options: 'i' } },
        { contentDescription: { $regex: search, $options: 'i' } }
      ];
    }

    const latestJobs = await LatestJobs.find(query)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await LatestJobs.countDocuments(query);

    res.json({
      success: true,
      data: latestJobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching latest jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get latest jobs by category (Admin only)
router.get('/admin/category/:category', authenticateAdmin, async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const validCategories = ['Results', 'AdmitCards', 'AnswerKey', 'Syllabus', 'Admission', 'Importance','LatestJobs'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category'
      });
    }

    const latestJobs = await LatestJobs.find({ category })
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await LatestJobs.countDocuments({ category });

    res.json({
      success: true,
      data: latestJobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching latest jobs by category:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single latest job by ID (Admin only) - must come after specific routes
router.get('/admin/:id', authenticateAdmin, async (req, res) => {
  try {
    // Check if the ID is a reserved word
    const reservedWords = ['create', 'all', 'category', 'search'];
    if (reservedWords.includes(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    // Validate ObjectId format
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    const latestJob = await LatestJobs.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!latestJob) {
      return res.status(404).json({
        success: false,
        message: 'Latest job not found'
      });
    }

    res.json({
      success: true,
      data: latestJob
    });
  } catch (error) {
    console.error('Error fetching latest job:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update latest job (Admin only)
router.put('/admin/:id', authenticateAdmin, async (req, res) => {
  try {
    // Check if the ID is a reserved word
    const reservedWords = ['create', 'all', 'category', 'search'];
    if (reservedWords.includes(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    // Validate ObjectId format
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    const { 
      category, 
      metaTitle, 
      metaDescription, 
      metaTags, 
      keywords, 
      contentTitle, 
      contentDescription, 
      isActive 
    } = req.body;

    const latestJob = await LatestJobs.findById(req.params.id);
    if (!latestJob) {
      return res.status(404).json({
        success: false,
        message: 'Latest job not found'
      });
    }

    // Validate category if provided
    if (category) {
      const validCategories = ['Results', 'AdmitCards', 'AnswerKey', 'Syllabus', 'Admission', 'Importance','LatestJobs'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category. Must be one of: Results, AdmitCards, AnswerKey, Syllabus, Admission, Importance'
        });
      }
    }

    const updateData = {
      updatedBy: req.user.userId
    };

    if (category !== undefined) updateData.category = category;
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle;
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription;
    if (metaTags !== undefined) updateData.metaTags = metaTags;
    if (keywords !== undefined) updateData.keywords = keywords;
    if (contentTitle !== undefined) updateData.contentTitle = contentTitle;
    if (contentDescription !== undefined) updateData.contentDescription = contentDescription;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedLatestJob = await LatestJobs.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email')
     .populate('updatedBy', 'name email');

    res.json({
      success: true,
      message: 'Latest job updated successfully',
      data: updatedLatestJob
    });
  } catch (error) {
    console.error('Error updating latest job:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete latest job (Admin only)
router.delete('/admin/:id', authenticateAdmin, async (req, res) => {
  try {
    // Check if the ID is a reserved word
    const reservedWords = ['create', 'all', 'category', 'search'];
    if (reservedWords.includes(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    // Validate ObjectId format
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    const latestJob = await LatestJobs.findById(req.params.id);
    if (!latestJob) {
      return res.status(404).json({
        success: false,
        message: 'Latest job not found'
      });
    }

    await LatestJobs.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Latest job deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting latest job:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Public Routes - Read only

// Get all active latest jobs (Public)
router.get('/public/all', async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const skip = (page - 1) * limit;

    let query = { isActive: true };
    
    if (category) {
      const validCategories = ['Results', 'AdmitCards', 'AnswerKey', 'Syllabus', 'Admission', 'Importance','LatestJobs'];
      if (validCategories.includes(category)) {
        query.category = category;
      }
    }

    const latestJobs = await LatestJobs.find(query)
      .select('-createdBy -updatedBy -__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await LatestJobs.countDocuments(query);

    res.json({
      success: true,
      data: latestJobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching latest jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Specific category endpoints for easier access (must come before /public/:id)
// Get Results (Public)
router.get('/public/results', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const latestJobs = await LatestJobs.find({ category: 'Results', isActive: true })
      .select('-createdBy -updatedBy -__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await LatestJobs.countDocuments({ category: 'Results', isActive: true });

    res.json({
      success: true,
      data: latestJobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get AdmitCards (Public)
router.get('/public/admitcards', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const latestJobs = await LatestJobs.find({ category: 'AdmitCards', isActive: true })
      .select('-createdBy -updatedBy -__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await LatestJobs.countDocuments({ category: 'AdmitCards', isActive: true });

    res.json({
      success: true,
      data: latestJobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching admit cards:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get AnswerKey (Public)
router.get('/public/answerkey', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const latestJobs = await LatestJobs.find({ category: 'AnswerKey', isActive: true })
      .select('-createdBy -updatedBy -__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await LatestJobs.countDocuments({ category: 'AnswerKey', isActive: true });

    res.json({
      success: true,
      data: latestJobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching answer keys:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get Syllabus (Public)
router.get('/public/syllabus', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const latestJobs = await LatestJobs.find({ category: 'Syllabus', isActive: true })
      .select('-createdBy -updatedBy -__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await LatestJobs.countDocuments({ category: 'Syllabus', isActive: true });

    res.json({
      success: true,
      data: latestJobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching syllabus:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get Admission (Public)
router.get('/public/admission', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const latestJobs = await LatestJobs.find({ category: 'Admission', isActive: true })
      .select('-createdBy -updatedBy -__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await LatestJobs.countDocuments({ category: 'Admission', isActive: true });

    res.json({
      success: true,
      data: latestJobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching admission:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get Importance (Public)
router.get('/public/importance', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const latestJobs = await LatestJobs.find({ category: 'Importance', isActive: true })
      .select('-createdBy -updatedBy -__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await LatestJobs.countDocuments({ category: 'Importance', isActive: true });

    res.json({
      success: true,
      data: latestJobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching importance:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get latest jobs by category (Public)
router.get('/public/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const validCategories = ['Results', 'AdmitCards', 'AnswerKey', 'Syllabus', 'Admission', 'Importance','LatestJobs'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category'
      });
    }

    const latestJobs = await LatestJobs.find({ category, isActive: true })
      .select('-createdBy -updatedBy -__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await LatestJobs.countDocuments({ category, isActive: true });

    res.json({
      success: true,
      data: latestJobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching latest jobs by category:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get latest jobs by search (Public)
router.get('/public/search', async (req, res) => {
  try {
    const { q, page = 1, limit = 10, category } = req.query;
    const skip = (page - 1) * limit;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    let query = { 
      isActive: true,
      $or: [
        { metaTitle: { $regex: q, $options: 'i' } },
        { contentTitle: { $regex: q, $options: 'i' } },
        { contentDescription: { $regex: q, $options: 'i' } },
        { keywords: { $in: [new RegExp(q, 'i')] } }
      ]
    };

    if (category) {
      const validCategories = ['Results', 'AdmitCards', 'AnswerKey', 'Syllabus', 'Admission', 'Importance','LatestJobs'];
      if (validCategories.includes(category)) {
        query.category = category;
      }
    }

    const latestJobs = await LatestJobs.find(query)
      .select('-createdBy -updatedBy -__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await LatestJobs.countDocuments(query);

    res.json({
      success: true,
      data: latestJobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error searching latest jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single latest job by ID (Public) - must come last to avoid conflicts
router.get('/public/:id', async (req, res) => {
  try {
    // Validate ObjectId format
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    const latestJob = await LatestJobs.findOne({ 
      _id: req.params.id, 
      isActive: true 
    }).select('-createdBy -updatedBy -__v');

    if (!latestJob) {
      return res.status(404).json({
        success: false,
        message: 'Latest job not found'
      });
    }

    res.json({
      success: true,
      data: latestJob
    });
  } catch (error) {
    console.error('Error fetching latest job:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router; 