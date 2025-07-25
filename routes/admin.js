const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Employee = require('../models/employee.model');
const MainCategory = require('../models/mainCategory.model');
const SubCategory = require('../models/subCategory.model');
const FAQ = require('../models/faq.model');
const TopData = require('../models/topData.model');
const SystemPrompt = require('../models/systemPrompt.model');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Admin Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    // Create new admin user
    const admin = new User({
      name,
      email,
      password,
      role: 'admin'
    });

    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: admin._id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Admin created successfully',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin user
    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Verify password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: admin._id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Admin login successful',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create Employee (Admin only)
router.post('/employees', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, email, userId, password } = req.body;

    // Check if employee already exists
    const existingEmployee = await Employee.findOne({ 
      $or: [{ email }, { userId }] 
    });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee already exists' });
    }

    // Create new employee
    const employee = new Employee({
      name,
      email,
      userId,
      password,
      createdBy: req.user.userId
    });

    await employee.save();

    res.status(201).json({
      message: 'Employee created successfully',
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        userId: employee.userId
      }
    });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get All Employees (Admin only)
router.get('/employees', authenticateToken, isAdmin, async (req, res) => {
  try {
    const employees = await Employee.find({ isActive: true })
      .select('-password')
      .populate('createdBy', 'name email');

    res.json({
      employees
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create Main Category (Admin only)
router.post('/categories/main', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { title } = req.body;

    // Check if category already exists
    const existingCategory = await MainCategory.findOne({ title });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    // Create new main category
    const category = new MainCategory({
      title,
      createdBy: req.user.userId
    });

    await category.save();

    res.status(201).json({
      message: 'Main category created successfully',
      category: {
        id: category._id,
        title: category.title
      }
    });
  } catch (error) {
    console.error('Create main category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get All Main Categories (Admin only)
router.get('/categories/main', authenticateToken, isAdmin, async (req, res) => {
  try {
    const categories = await MainCategory.find({ isActive: true })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 }); // Newest first

    res.json({
      categories
    });
  } catch (error) {
    console.error('Get main categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Single Main Category by ID (Admin only)
router.get('/categories/main/:id', authenticateToken, isAdmin, async (req, res) => {
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

    const category = await MainCategory.findById(id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!category) {
      return res.status(404).json({ 
        success: false,
        message: 'Main category not found' 
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Get main category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Main Category (Admin only)
router.put('/categories/main/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, isActive } = req.body;

    // Validate ObjectId format
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid ID format' 
      });
    }

    // Check if main category exists
    const category = await MainCategory.findById(id);
    if (!category) {
      return res.status(404).json({ 
        success: false,
        message: 'Main category not found' 
      });
    }

    // Check if title already exists (excluding current category)
    if (title && title !== category.title) {
      const existingCategory = await MainCategory.findOne({ 
        title, 
        _id: { $ne: id } 
      });
      if (existingCategory) {
        return res.status(400).json({ 
          success: false,
          message: 'Category with this title already exists' 
        });
      }
    }

    // Prepare update data
    const updateData = {
      updatedBy: req.user.userId
    };

    if (title !== undefined) updateData.title = title;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedCategory = await MainCategory.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    res.json({
      success: true,
      message: 'Main category updated successfully',
      data: updatedCategory
    });
  } catch (error) {
    console.error('Update main category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete Main Category (Admin only)
router.delete('/categories/main/:id', authenticateToken, isAdmin, async (req, res) => {
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

    // Check if main category exists
    const category = await MainCategory.findById(id);
    if (!category) {
      return res.status(404).json({ 
        success: false,
        message: 'Main category not found' 
      });
    }

    // Soft delete by setting isActive to false
    await MainCategory.findByIdAndUpdate(id, { 
      isActive: false,
      updatedBy: req.user.userId
    });

    res.json({
      success: true,
      message: 'Main category deleted successfully'
    });
  } catch (error) {
    console.error('Delete main category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create Sub Category (Admin only)
router.post('/categories/sub', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { 
      mainCategory, 
      metaTitle, 
      metaDescription, 
      keywords, 
      tags, 
      contentTitle, 
      contentDescription 
    } = req.body;

    // Check if main category exists
    const mainCat = await MainCategory.findById(mainCategory);
    if (!mainCat) {
      return res.status(400).json({ message: 'Main category not found' });
    }

    // Create new sub category
    const subCategory = new SubCategory({
      mainCategory,
      metaTitle,
      metaDescription,
      keywords: keywords || [],
      tags: tags || [],
      contentTitle,
      contentDescription,
      createdBy: req.user.userId
    });

    await subCategory.save();

    res.status(201).json({
      message: 'Sub category created successfully',
      subCategory: {
        id: subCategory._id,
        metaTitle: subCategory.metaTitle,
        contentTitle: subCategory.contentTitle
      }
    });
  } catch (error) {
    console.error('Create sub category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get All Sub Categories (Admin only)
router.get('/categories/sub', authenticateToken, isAdmin, async (req, res) => {
  try {
    const subCategories = await SubCategory.find({ isActive: true })
      .populate('mainCategory', 'title createdAt')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ 'mainCategory.createdAt': -1 }); // Sort by main category creation date (newest first)

    res.json({
      subCategories
    });
  } catch (error) {
    console.error('Get sub categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Single Sub Category by ID (Admin only)
router.get('/categories/sub/:id', authenticateToken, isAdmin, async (req, res) => {
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

    const subCategory = await SubCategory.findById(id)
      .populate('mainCategory', 'title createdAt')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!subCategory) {
      return res.status(404).json({ 
        success: false,
        message: 'Sub category not found' 
      });
    }

    res.json({
      success: true,
      data: subCategory
    });
  } catch (error) {
    console.error('Get sub category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Sub Category (Admin only)
router.put('/categories/sub/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      mainCategory, 
      metaTitle, 
      metaDescription, 
      keywords, 
      tags, 
      contentTitle, 
      contentDescription,
      isActive
    } = req.body;

    // Validate ObjectId format
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid ID format' 
      });
    }

    // Check if sub category exists
    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      return res.status(404).json({ 
        success: false,
        message: 'Sub category not found' 
      });
    }

    // Check if main category exists if provided
    if (mainCategory) {
      const mainCat = await MainCategory.findById(mainCategory);
      if (!mainCat) {
        return res.status(400).json({ 
          success: false,
          message: 'Main category not found' 
        });
      }
    }

    // Prepare update data
    const updateData = {
      updatedBy: req.user.userId
    };

    if (mainCategory !== undefined) updateData.mainCategory = mainCategory;
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle;
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription;
    if (keywords !== undefined) updateData.keywords = keywords;
    if (tags !== undefined) updateData.tags = tags;
    if (contentTitle !== undefined) updateData.contentTitle = contentTitle;
    if (contentDescription !== undefined) updateData.contentDescription = contentDescription;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('mainCategory', 'title createdAt')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    res.json({
      success: true,
      message: 'Sub category updated successfully',
      data: updatedSubCategory
    });
  } catch (error) {
    console.error('Update sub category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete Sub Category (Admin only)
router.delete('/categories/sub/:id', authenticateToken, isAdmin, async (req, res) => {
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

    // Check if sub category exists
    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      return res.status(404).json({ 
        success: false,
        message: 'Sub category not found' 
      });
    }

    // Soft delete by setting isActive to false
    await SubCategory.findByIdAndUpdate(id, { 
      isActive: false,
      updatedBy: req.user.userId
    });

    res.json({
      success: true,
      message: 'Sub category deleted successfully'
    });
  } catch (error) {
    console.error('Delete sub category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create Top Data (Admin only)
router.post('/topdata', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { 
      metaTitle, 
      metaDescription, 
      keywords, 
      tags, 
      contentTitle, 
      contentDescription,
      colorCode
    } = req.body;

    // Create new top data
    const topData = new TopData({
      metaTitle,
      metaDescription,
      keywords: keywords || [],
      tags: tags || [],
      contentTitle,
      contentDescription,
      colorCode: colorCode || '#000000',
      createdBy: req.user.userId
    });

    await topData.save();

    res.status(201).json({
      message: 'Top data created successfully',
      topData: {
        id: topData._id,
        metaTitle: topData.metaTitle,
        contentTitle: topData.contentTitle,
        colorCode: topData.colorCode
      }
    });
  } catch (error) {
    console.error('Create top data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get All Top Data (Admin only)
router.get('/topdata', authenticateToken, isAdmin, async (req, res) => {
  try {
    const topDataList = await TopData.find({ isActive: true })
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ createdAt: -1 }); // Newest first

    res.json({
      topDataList
    });
  } catch (error) {
    console.error('Get top data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/users/topdata',  async (req, res) => {
  try {
    const topDataList = await TopData.find({ isActive: true })
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ createdAt: -1 }); // Newest first

    res.json({
      topDataList
    });
  } catch (error) {
    console.error('Get top data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Get Single Top Data (Admin only)
router.get('/topdata/:id', authenticateToken, isAdmin, async (req, res) => {
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

    const topData = await TopData.findById(id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!topData) {
      return res.status(404).json({ 
        success: false,
        message: 'Top data not found' 
      });
    }

    res.json({
      success: true,
      data: topData
    });
  } catch (error) {
    console.error('Get single top data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Top Data (Admin only)
router.put('/topdata/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      metaTitle, 
      metaDescription, 
      keywords, 
      tags, 
      contentTitle, 
      contentDescription,
      colorCode,
      isActive
    } = req.body;

    // Validate ObjectId format
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid ID format' 
      });
    }

    // Check if top data exists
    const topData = await TopData.findById(id);
    if (!topData) {
      return res.status(404).json({ 
        success: false,
        message: 'Top data not found' 
      });
    }

    // Update fields if provided
    if (metaTitle !== undefined) topData.metaTitle = metaTitle;
    if (metaDescription !== undefined) topData.metaDescription = metaDescription;
    if (keywords !== undefined) topData.keywords = keywords;
    if (tags !== undefined) topData.tags = tags;
    if (contentTitle !== undefined) topData.contentTitle = contentTitle;
    if (contentDescription !== undefined) topData.contentDescription = contentDescription;
    if (colorCode !== undefined) topData.colorCode = colorCode;
    if (isActive !== undefined) topData.isActive = isActive;

    topData.updatedBy = req.user.userId;
    await topData.save();

    const updatedTopData = await TopData.findById(id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    res.json({
      success: true,
      message: 'Top data updated successfully',
      data: updatedTopData
    });
  } catch (error) {
    console.error('Update top data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete Top Data (Admin only)
router.delete('/topdata/:id', authenticateToken, isAdmin, async (req, res) => {
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

    // Check if top data exists
    const topData = await TopData.findById(id);
    if (!topData) {
      return res.status(404).json({ 
        success: false,
        message: 'Top data not found' 
      });
    }

    // Soft delete by setting isActive to false
    await TopData.findByIdAndUpdate(id, { 
      isActive: false,
      updatedBy: req.user.userId
    });

    res.json({
      success: true,
      message: 'Top data deleted successfully'
    });
  } catch (error) {
    console.error('Delete top data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create FAQ (Admin only)
router.post('/faqs', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { 
      subCategory, 
      question, 
      answer, 
      order 
    } = req.body;

    // Check if sub category exists
    const subCat = await SubCategory.findById(subCategory);
    if (!subCat) {
      return res.status(400).json({ message: 'Sub category not found' });
    }

    // Create new FAQ
    const faq = new FAQ({
      subCategory,
      question,
      answer,
      order: order || 0,
      createdBy: req.user.userId
    });

    await faq.save();

    res.status(201).json({
      message: 'FAQ created successfully',
      faq: {
        id: faq._id,
        question: faq.question,
        order: faq.order
      }
    });
  } catch (error) {
    console.error('Create FAQ error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get All FAQs (Admin only)
router.get('/faqs', authenticateToken, isAdmin, async (req, res) => {
  try {
    const faqs = await FAQ.find({ isActive: true })
      .populate('subCategory', 'metaTitle contentTitle')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ order: 1 });

    res.json({
      faqs
    });
  } catch (error) {
    console.error('Get FAQs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get FAQs by Sub Category (Admin only)
router.get('/faqs/subcategory/:subCategoryId', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { subCategoryId } = req.params;

    const faqs = await FAQ.find({ 
      subCategory: subCategoryId, 
      isActive: true 
    })
      .populate('subCategory', 'metaTitle contentTitle')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ order: 1 });

    res.json({
      faqs
    });
  } catch (error) {
    console.error('Get FAQs by sub category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== SYSTEM PROMPT ROUTES ====================

// Create System Prompt (Admin only) - Only one system prompt allowed
router.post('/system-prompt', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { systemPrompt, description } = req.body;

    // Check if system prompt already exists
    const existingSystemPrompt = await SystemPrompt.findOne({ isActive: true });
    if (existingSystemPrompt) {
      return res.status(400).json({ 
        success: false,
        message: 'System prompt already exists. Only one system prompt is allowed. Please update the existing one instead.' 
      });
    }

    // Create new system prompt
    const newSystemPrompt = new SystemPrompt({
      systemPrompt,
      description,
      createdBy: req.user.userId
    });

    await newSystemPrompt.save();

    const populatedSystemPrompt = await SystemPrompt.findById(newSystemPrompt._id)
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'System prompt created successfully',
      data: populatedSystemPrompt
    });
  } catch (error) {
    console.error('Create system prompt error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// Get System Prompt (Admin only)
router.get('/system-prompt', authenticateToken, isAdmin, async (req, res) => {
  try {
    const systemPrompt = await SystemPrompt.findOne({ isActive: true })
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!systemPrompt) {
      return res.status(404).json({ 
        success: false,
        message: 'No system prompt found' 
      });
    }

    res.json({
      success: true,
      data: systemPrompt
    });
  } catch (error) {
    console.error('Get system prompt error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

router.get('/users/system-prompt',   async (req, res) => {
  try {
    const systemPrompt = await SystemPrompt.findOne({ isActive: true })
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!systemPrompt) {
      return res.status(404).json({ 
        success: false,
        message: 'No system prompt found' 
      });
    }

    res.json({
      success: true,
      data: systemPrompt
    });
  } catch (error) {
    console.error('Get system prompt error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});
// Get System Prompt by ID (Admin only)
router.get('/system-prompt/:id', authenticateToken, isAdmin, async (req, res) => {
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

    const systemPrompt = await SystemPrompt.findById(id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!systemPrompt) {
      return res.status(404).json({ 
        success: false,
        message: 'System prompt not found' 
      });
    }

    res.json({
      success: true,
      data: systemPrompt
    });
  } catch (error) {
    console.error('Get system prompt by ID error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// Update System Prompt (Admin only)
router.put('/system-prompt/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { systemPrompt, description, isActive } = req.body;

    // Validate ObjectId format
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid ID format' 
      });
    }

    // Check if system prompt exists
    const existingSystemPrompt = await SystemPrompt.findById(id);
    if (!existingSystemPrompt) {
      return res.status(404).json({ 
        success: false,
        message: 'System prompt not found' 
      });
    }

    // Update fields if provided
    if (systemPrompt !== undefined) existingSystemPrompt.systemPrompt = systemPrompt;
    if (description !== undefined) existingSystemPrompt.description = description;
    if (isActive !== undefined) existingSystemPrompt.isActive = isActive;

    existingSystemPrompt.updatedBy = req.user.userId;
    await existingSystemPrompt.save();

    const updatedSystemPrompt = await SystemPrompt.findById(id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    res.json({
      success: true,
      message: 'System prompt updated successfully',
      data: updatedSystemPrompt
    });
  } catch (error) {
    console.error('Update system prompt error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// Delete System Prompt (Admin only)
router.delete('/system-prompt/:id', authenticateToken, isAdmin, async (req, res) => {
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

    // Check if system prompt exists
    const systemPrompt = await SystemPrompt.findById(id);
    if (!systemPrompt) {
      return res.status(404).json({ 
        success: false,
        message: 'System prompt not found' 
      });
    }

    // Soft delete by setting isActive to false
    await SystemPrompt.findByIdAndUpdate(id, { 
      isActive: false,
      updatedBy: req.user.userId
    });

    res.json({
      success: true,
      message: 'System prompt deleted successfully'
    });
  } catch (error) {
    console.error('Delete system prompt error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

module.exports = router; 